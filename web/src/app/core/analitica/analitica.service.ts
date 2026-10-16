import { DOCUMENT, Injectable, Injector, effect, inject, untracked } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ENTORNO } from '@core/config/entorno.token';
import { filter } from 'rxjs';
import { ConsentimientoService } from './consentimiento.service';
import { gtag, silenciarGoogleAnalytics } from './gtag';
import type { EstadoConsentimiento } from './interfaces/estado-consentimiento.type';
import { dominiosDeCookies, ubicacionSinDatos } from './ubicacion-analitica';

/**
 * Google Analytics, solo si el visitante lo acepta: hasta entonces no se carga nada de Google.
 * Cuenta una visita por cada página que se abre, con la dirección limpia (sin `?…` ni `#…`) y
 * sin datos personales. Si después rechaza, se deja de medir y se borran sus cookies.
 */
@Injectable({ providedIn: 'root' })
export class AnaliticaService {
  private readonly id = inject(ENTORNO).idAnalitica;
  private readonly consentimiento = inject(ConsentimientoService);
  private readonly router = inject(Router);
  private readonly documento = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  private cargada = false;
  private midiendo = false;
  private ultimaPagina: string | null = null;

  inicializar(): void {
    const id = this.id;
    if (!id) {
      return;
    }
    effect(
      () => {
        const estado = this.consentimiento.estado();
        untracked(() => this.aplicar(id, estado));
      },
      { injector: this.injector },
    );
    // El título de la pestaña se cambia justo después de terminar la navegación.
    this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe(() => queueMicrotask(() => this.contarPagina()));
  }

  private aplicar(id: string, estado: EstadoConsentimiento): void {
    if (estado === 'aceptado') {
      silenciarGoogleAnalytics(id, false);
      if (this.cargada) {
        gtag('consent', 'update', { analytics_storage: 'granted' });
      } else {
        this.cargar(id);
      }
      this.midiendo = true;
      this.ultimaPagina = null;
      // La primera página la cuenta el final de la primera navegación.
      if (this.router.navigated) {
        this.contarPagina();
      }
    } else if (estado === 'rechazado') {
      if (this.cargada) {
        gtag('consent', 'update', { analytics_storage: 'denied' });
        silenciarGoogleAnalytics(id, true);
      }
      this.midiendo = false;
      this.borrarCookies();
    }
  }

  private cargar(id: string): void {
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted',
    });
    gtag('js', new Date());
    gtag('set', this.pagina(this.ubicacion(), this.procedenciaExterna()));
    // Sin datos de la página: si los llevara, mandarían sobre los de `set` en cada evento.
    gtag('config', id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    const script = this.documento.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    this.documento.head.append(script);
    this.cargada = true;
  }

  private contarPagina(): void {
    const ubicacion = this.ubicacion();
    if (!this.midiendo || ubicacion === this.ultimaPagina) {
      return;
    }
    const pagina = this.pagina(ubicacion, this.ultimaPagina ?? this.procedenciaExterna());
    this.ultimaPagina = ubicacion;
    // Con `set`, también lo que mide Google por su cuenta (clics a otras webs, desplazamiento…)
    // lleva la dirección limpia y no la completa.
    gtag('set', pagina);
    gtag('event', 'page_view', pagina);
  }

  /** La página que se cuenta: dirección limpia, la de antes y el título de la pestaña. */
  private pagina(ubicacion: string, procedencia: string): Record<string, string> {
    return {
      page_location: ubicacion,
      page_referrer: procedencia,
      page_title: this.documento.title,
    };
  }

  private ubicacion(): string {
    return ubicacionSinDatos(this.documento.location.href);
  }

  /** La web desde la que se llegó, también sin `?…` ni `#…`; vacío si se escribió la dirección. */
  private procedenciaExterna(): string {
    const referente = this.documento.referrer;
    return referente ? ubicacionSinDatos(referente) : '';
  }

  /** `_ga` y `_ga_…`, en el dominio del sitio y en los de encima, que es donde las deja Google. */
  private borrarCookies(): void {
    const nombres = this.documento.cookie
      .split(';')
      .map((cookie) => cookie.split('=')[0].trim())
      .filter((nombre) => nombre === '_ga' || nombre.startsWith('_ga_'));
    const dominios = dominiosDeCookies(this.documento.location.hostname);
    for (const nombre of nombres) {
      this.documento.cookie = `${nombre}=; Max-Age=0; path=/`;
      for (const dominio of dominios) {
        this.documento.cookie = `${nombre}=; Max-Age=0; path=/; domain=${dominio}`;
      }
    }
  }
}
