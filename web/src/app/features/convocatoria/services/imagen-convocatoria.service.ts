import { DOCUMENT, Injectable, inject } from '@angular/core';
import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { TablaConvocatoria } from '../interfaces/tabla-convocatoria.interface';

/** Medidas en píxeles de pantalla; la imagen se dibuja a más resolución. */
const TAMANO_LETRA = 20;
const ALTO_FILA = 40;
const MARGEN_CELDA = 12;
const ANCHO_MINIMO_NOMBRE = 150;
const ESCALA_MINIMA = 2;

const COLOR_ETIQUETA: Record<TipoPartido, string> = {
  masculino: '--color-convocatoria-masculino',
  femenino: '--color-convocatoria-femenino',
  mixto: '--color-convocatoria-mixto',
};

/**
 * Dibuja la convocatoria como la tabla que manda el capitán por WhatsApp: cabecera azul y
 * una fila por pareja con su etiqueta de color, revés y drive. Los colores y la letra salen
 * de los tokens del sistema de diseño. Se provee en la página de convocatoria.
 */
@Injectable()
export class ImagenConvocatoriaService {
  private readonly documento = inject(DOCUMENT);

  /** PNG de la tabla. Espera a que la letra de la web esté cargada para medir bien. */
  async generar(tabla: TablaConvocatoria): Promise<Blob> {
    const estilos = this.documento.defaultView?.getComputedStyle(this.documento.documentElement);
    const token = (nombre: string): string => estilos?.getPropertyValue(nombre).trim() ?? '';
    const fuente = token('--fuente') || 'sans-serif';
    const letra = (peso: number): string => `${peso} ${TAMANO_LETRA}px ${fuente}`;
    await Promise.all([this.cargarLetra(letra(400)), this.cargarLetra(letra(700))]);

    const lienzo = this.documento.createElement('canvas');
    const contexto = lienzo.getContext('2d');
    if (!contexto) {
      throw new Error('El navegador no puede dibujar la imagen.');
    }

    const medir = (texto: string, peso: number): number => {
      contexto.font = letra(peso);
      return Math.ceil(contexto.measureText(texto).width) + 2 * MARGEN_CELDA;
    };
    const ancho = (textos: readonly string[], peso: number, minimo = 0): number =>
      Math.max(minimo, ...textos.map((texto) => medir(texto, peso)));
    const columnas = [
      ancho(
        tabla.filas.map((f) => f.etiqueta),
        700,
      ),
      ancho(
        tabla.filas.map((f) => f.reves),
        400,
        ANCHO_MINIMO_NOMBRE,
      ),
      ancho(
        tabla.filas.map((f) => f.drive),
        400,
        ANCHO_MINIMO_NOMBRE,
      ),
    ];
    // Si la cabecera no cabe, se ensancha la última columna.
    const sobra = medir(tabla.titulo, 700) - columnas.reduce((a, b) => a + b, 0);
    if (sobra > 0) {
      columnas[2] = (columnas[2] ?? 0) + sobra;
    }
    const anchoTotal = columnas.reduce((a, b) => a + b, 0);
    const altoTotal = (tabla.filas.length + 1) * ALTO_FILA;

    const escala = Math.max(ESCALA_MINIMA, this.documento.defaultView?.devicePixelRatio ?? 1);
    lienzo.width = Math.ceil(anchoTotal * escala);
    lienzo.height = Math.ceil(altoTotal * escala);
    contexto.scale(escala, escala);
    contexto.textBaseline = 'middle';

    const celda = (
      x: number,
      y: number,
      w: number,
      fondo: string,
      texto: string,
      peso: number,
    ): void => {
      contexto.fillStyle = fondo;
      contexto.fillRect(x, y, w, ALTO_FILA);
      contexto.fillStyle = token('--color-tinta');
      contexto.font = letra(peso);
      contexto.fillText(texto, x + MARGEN_CELDA, y + ALTO_FILA / 2);
    };

    celda(0, 0, anchoTotal, token('--color-convocatoria-cabecera'), tabla.titulo, 700);
    tabla.filas.forEach((fila, indice) => {
      const y = (indice + 1) * ALTO_FILA;
      const [anchoEtiqueta = 0, anchoReves = 0, anchoDrive = 0] = columnas;
      celda(0, y, anchoEtiqueta, token(COLOR_ETIQUETA[fila.tipo]), fila.etiqueta, 400);
      celda(anchoEtiqueta, y, anchoReves, token('--color-superficie'), fila.reves, 400);
      celda(
        anchoEtiqueta + anchoReves,
        y,
        anchoDrive,
        token('--color-superficie'),
        fila.drive,
        400,
      );
    });
    this.dibujarRejilla(contexto, columnas, tabla.filas.length + 1, token('--color-borde-fuerte'));

    return new Promise((resolver, rechazar) =>
      lienzo.toBlob(
        (png) => (png ? resolver(png) : rechazar(new Error('No se ha podido crear la imagen.'))),
        'image/png',
      ),
    );
  }

  private async cargarLetra(letra: string): Promise<void> {
    try {
      await this.documento.fonts?.load(letra);
    } catch {
      // Sin la letra de la web se dibuja con la de respaldo: mejor eso que no copiar.
    }
  }

  private dibujarRejilla(
    contexto: CanvasRenderingContext2D,
    columnas: readonly number[],
    filas: number,
    color: string,
  ): void {
    const anchoTotal = columnas.reduce((a, b) => a + b, 0);
    contexto.strokeStyle = color;
    contexto.lineWidth = 1;
    contexto.beginPath();
    // Medio píxel dentro del borde para que las líneas no salgan cortadas.
    const altoTotal = filas * ALTO_FILA;
    for (let fila = 0; fila <= filas; fila++) {
      const y = Math.min(fila * ALTO_FILA, altoTotal - 1) + 0.5;
      contexto.moveTo(0, y);
      contexto.lineTo(anchoTotal, y);
    }
    // Las líneas verticales empiezan bajo la cabecera, que ocupa toda la fila.
    let x = 0;
    for (const ancho of [0, ...columnas]) {
      x += ancho;
      const borde = Math.min(x, anchoTotal - 1) + 0.5;
      contexto.moveTo(borde, x === 0 || x >= anchoTotal ? 0 : ALTO_FILA);
      contexto.lineTo(borde, altoTotal);
    }
    contexto.stroke();
  }
}
