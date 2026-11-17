import { BaseDeDatos } from './base-de-datos.ts';
import { descargarPagina } from './descargar.ts';
import { faseActiva, hoyEnMadrid } from './fase-activa.ts';
import type { EquipoConocido } from './interfaces/equipo-conocido.interface.ts';
import type { FaseALeer } from './interfaces/fase-a-leer.interface.ts';
import type { PlanFase } from './interfaces/plan-fase.interface.ts';
import { analizarPaginaEliminatoria } from './pagina-eliminatoria.ts';
import { analizarPaginaGrupo } from './pagina-grupo.ts';
import { crucesNuestros, planificarEliminatoria } from './planificar-eliminatoria.ts';
import { planificarFase } from './planificar-fase.ts';
import { nombresDeCruces, nombresDeGrupo, resolverEquipos } from './resolver-equipos.ts';

/** Las fases que son un grupo con jornadas y clasificación; el resto son eliminatorias. */
const TIPOS_DE_GRUPO = ['apertura', 'clausura'];

/**
 * Lee la página de cada fase en juego y actualiza equipos, calendario, resultados del grupo y
 * clasificación. Registra cada ejecución en `ejecucion_scraper`; si una fase falla, no deja
 * nada a medias de esa fase y lo cuenta. Modos:
 *   node src/index.ts              lee y escribe
 *   node src/index.ts --simular    lee la liga y la base de datos, cuenta qué cambiaría y no escribe
 *   node src/index.ts --leer URL   solo descarga y muestra lo que entiende de una página
 */
async function main(argumentos: readonly string[]): Promise<void> {
  if (argumentos[0] === '--leer') {
    const url = argumentos[1];
    if (!url) {
      throw new Error('Falta la URL: node src/index.ts --leer https://…');
    }
    const html = await descargarPagina(url);
    const leido = /class=["']tabla["']/.test(html)
      ? analizarPaginaGrupo(html)
      : analizarPaginaEliminatoria(html);
    console.log(JSON.stringify(leido, null, 2));
    return;
  }

  const simular = argumentos.includes('--simular');
  const clave = process.env['SUPABASE_SECRET_KEY'];
  if (!clave) {
    throw new Error('Falta la variable SUPABASE_SECRET_KEY');
  }
  const bd = new BaseDeDatos(clave);
  const hoy = hoyEnMadrid();
  const lineas: string[] = [];
  let ok = true;

  const fases = (await bd.fasesConPagina()).filter((fase) => faseActiva(fase, hoy));
  if (fases.length === 0) {
    lineas.push('Ninguna fase en juego con página en la liga: nada que leer.');
  }
  for (const fase of fases) {
    try {
      lineas.push(await sincronizarFase(bd, fase, simular));
    } catch (error) {
      ok = false;
      lineas.push(
        `${fase.nombre}: ERROR, ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  const mensaje = `${simular ? '[simulación] ' : ''}${lineas.join('\n')}`;
  console.log(mensaje);
  if (!simular) {
    await bd.registrarEjecucion(ok, mensaje);
  }
  if (!ok) {
    process.exitCode = 1;
  }
}

async function sincronizarFase(
  bd: BaseDeDatos,
  fase: FaseALeer,
  simular: boolean,
): Promise<string> {
  const html = await descargarPagina(fase.urlGrupo);
  const equipos = await bd.equipos();
  const partes: string[] = [];

  // Qué equipos hay que tener y cómo se planifica dependen de si es un grupo o una eliminatoria.
  let nombres: string[];
  let planificar: (equiposCompletos: readonly EquipoConocido[]) => PlanFase;
  const confrontaciones = await bd.confrontacionesDeFase(fase.id);
  const marcadores = await bd.marcadoresNuestros(confrontaciones.map((c) => c.id));
  const contexto = (equiposCompletos: readonly EquipoConocido[]) => ({
    faseId: fase.id,
    faseNombre: fase.nombre,
    equipos: equiposCompletos,
    confrontaciones,
    marcadores,
  });
  if (TIPOS_DE_GRUPO.includes(fase.tipo)) {
    const pagina = analizarPaginaGrupo(html);
    partes.push(`página de ${pagina.fase ?? 'fase sin nombre'}`);
    nombres = nombresDeGrupo(pagina);
    planificar = (e) => planificarFase(pagina, contexto(e));
  } else {
    const cruces = crucesNuestros(analizarPaginaEliminatoria(html), equipos);
    partes.push(`${cruces.length} cruces nuestros`);
    nombres = nombresDeCruces(cruces);
    planificar = (e) => planificarEliminatoria(cruces, contexto(e));
  }

  const completos = await completarEquipos(bd, equipos, nombres, simular, partes);
  const plan = planificar(completos);

  if (plan.clasificacion.length > 0) {
    partes.push(`clasificación de ${plan.clasificacion.length} equipos`);
  }
  if (plan.nuevas.length > 0) {
    partes.push(`${plan.nuevas.length} confrontaciones nuevas`);
  }
  if (plan.actualizadas.length > 0) {
    partes.push(`resultados de ${plan.actualizadas.map((a) => `J${a.jornada}`).join(', ')}`);
  }
  if (!simular) {
    await bd.aplicarPlan(fase.id, plan);
  }

  const avisos = plan.avisos.length > 0 ? `\n  AVISO: ${plan.avisos.join('\n  AVISO: ')}` : '';
  return `${fase.nombre}: ${partes.join('; ')}.${avisos}`;
}

/** Crea los equipos que faltan y guarda el texto de la liga de los conocidos. */
async function completarEquipos(
  bd: BaseDeDatos,
  equipos: readonly EquipoConocido[],
  nombres: readonly string[],
  simular: boolean,
  partes: string[],
): Promise<EquipoConocido[]> {
  const ajustes = resolverEquipos(nombres, equipos);
  const completos = [...equipos];
  if (ajustes.nuevos.length > 0) {
    partes.push(`equipos nuevos: ${ajustes.nuevos.join(', ')}`);
    for (const nombre of ajustes.nuevos) {
      completos.push(
        simular
          ? { id: `nuevo:${nombre}`, nombre, nombreWeb: nombre, esNuestro: false }
          : await bd.crearEquipo(nombre),
      );
    }
  }
  if (!simular) {
    for (const { id, nombreWeb } of ajustes.renombrados) {
      await bd.ponerNombreWeb(id, nombreWeb);
    }
  }
  return completos;
}

main(process.argv.slice(2)).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
