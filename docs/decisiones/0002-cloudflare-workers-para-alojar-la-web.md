# 0002. Cloudflare Workers para alojar la web

- Estado: Aceptada
- Fecha: 2026-10-08

## Contexto

La web es una aplicación de una sola página: ficheros estáticos que hay que servir gratis,
con HTTPS y de forma que las rutas de Angular funcionen al recargar.

## Decisión

Alojarla en Cloudflare Workers con _static assets_ y `not_found_handling:
single-page-application`, desplegando automáticamente desde GitHub.

Alternativas descartadas: GitHub Pages (obliga a repositorio público y requiere un apaño para
las rutas), Cloudflare Pages (Cloudflare recomienda Workers para proyectos nuevos),
Netlify (plan gratuito por créditos) y Vercel (orientado a Next.js).

## Consecuencias

- Ancho de banda y peticiones a ficheros estáticos ilimitados en el plan gratuito.
- El repositorio puede seguir siendo privado.
- El comando de compilación de Cloudflare ejecuta linter y tests: si fallan, no se publica.
