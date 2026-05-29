# SEO Backend — Heritage Motors Auctions

## Rol SEO del Proyecto

Como SEO del proyecto, el backend debe garantizar que la plataforma entregue datos consistentes, rastreables, veloces e indexables para motores de búsqueda, redes sociales y consumidores frontend. Este backlog traduce la estrategia de **Heritage Motors Auctions** en tareas técnicas backend para subastas de automotores clásicos y de época.

---

## 1. APIs SEO e Indexabilidad

### Vehículos

- [ ] Crear endpoint público para ficha SEO de vehículo por slug.
- [ ] Exponer marca, modelo, año, versión, estado de restauración y ubicación.
- [ ] Exponer descripción histórica optimizada para indexación.
- [ ] Exponer precio base, moneda, estado de subasta y disponibilidad.
- [ ] Exponer galería principal con imagen destacada y metadatos.
- [ ] Exponer certificados, documentación histórica y procedencia cuando estén validados.
- [ ] Evitar que vehículos rechazados, borradores o privados aparezcan en respuestas públicas.

### Subastas

- [ ] Crear endpoint público para ficha SEO de subasta por slug.
- [ ] Exponer fecha de inicio, fecha de cierre y estado actual.
- [ ] Exponer puja actual, cantidad de pujas y moneda.
- [ ] Exponer reglas visibles de la subasta sin datos sensibles.
- [ ] Exponer URL canónica de la subasta.
- [ ] Definir respuesta para subastas finalizadas conservando valor histórico indexable.
- [ ] Evitar indexación de subastas canceladas, fraudulentas o internas.

### Categorías, Marcas y Modelos

- [ ] Crear endpoint público para categorías indexables.
- [ ] Crear endpoint público para marcas indexables.
- [ ] Crear endpoint público para modelos indexables.
- [ ] Exponer conteo de vehículos activos por categoría, marca y modelo.
- [ ] Exponer textos SEO editables para páginas de marca, modelo y categoría.
- [ ] Definir ordenamiento por relevancia, actualidad y actividad comercial.
- [ ] Excluir taxonomías sin contenido suficiente para evitar thin content.

### Fichas Históricas

- [ ] Crear endpoint para contenido editorial histórico por vehículo, marca o época.
- [ ] Exponer datos de fabricación, país de origen, período y valor coleccionable.
- [ ] Relacionar fichas históricas con vehículos y subastas activas.
- [ ] Permitir URLs indexables para contenido histórico evergreen.
- [ ] Validar fuentes y estado de revisión editorial antes de publicar.

---

## 2. Metadata Dinámica

### Titles

- [ ] Generar title único para cada vehículo.
- [ ] Generar title único para cada subasta.
- [ ] Generar title único para páginas de marca, modelo y categoría.
- [ ] Incluir marca, modelo, año y país cuando aplique.
- [ ] Limitar titles largos desde backend para evitar truncamientos excesivos.

### Descriptions

- [ ] Generar meta description por vehículo con datos comerciales e históricos.
- [ ] Generar meta description por subasta con estado, fecha y propuesta de valor.
- [ ] Generar meta description para páginas de listados filtrados indexables.
- [ ] Evitar descriptions duplicadas entre vehículos similares.
- [ ] Proveer fallback editorial cuando falten datos específicos.

### Canonicals

- [ ] Exponer URL canónica en cada respuesta SEO pública.
- [ ] Normalizar URLs con slug único y estable.
- [ ] Resolver duplicados entre filtros, parámetros y paginación.
- [ ] Definir canonical hacia la ficha principal cuando existan variantes de URL.
- [ ] Mantener redirects 301 para slugs antiguos.

### Open Graph y Twitter Cards

- [ ] Exponer `og:title` para vehículos, subastas y listados.
- [ ] Exponer `og:description` con texto comercial validado.
- [ ] Exponer `og:image` usando imagen destacada optimizada.
- [ ] Exponer `og:url` con la URL canónica.
- [ ] Exponer `twitter:card` con formato `summary_large_image`.
- [ ] Definir imagen fallback para páginas sin imagen propia.

---

## 3. Sitemap, Robots y URLs

### Sitemap XML

- [ ] Generar `sitemap.xml` con URLs públicas indexables.
- [ ] Incluir vehículos aprobados y publicados.
- [ ] Incluir subastas activas y finalizadas relevantes.
- [ ] Incluir páginas de marca, modelo, categoría y contenido histórico.
- [ ] Excluir login, panel admin, perfiles privados y rutas transaccionales.
- [ ] Agregar `lastmod` basado en actualización real de contenido.
- [ ] Dividir sitemaps cuando el volumen crezca.

### Robots

- [ ] Servir `robots.txt` desde backend o configuración pública coordinada.
- [ ] Bloquear rutas privadas y administrativas.
- [ ] Bloquear parámetros de tracking y búsqueda interna no indexable.
- [ ] Declarar ubicación del sitemap.
- [ ] Mantener entorno staging bloqueado para indexación.

### Slugs

- [ ] Generar slugs legibles para vehículos con marca, modelo y año.
- [ ] Generar slugs legibles para subastas con vehículo y fecha contextual.
- [ ] Garantizar unicidad de slugs sin agregar IDs visibles salvo necesidad.
- [ ] Guardar historial de slugs para redirects permanentes.
- [ ] Validar caracteres seguros para URLs regionales.

---

## 4. Datos Estructurados Schema.org

### Vehicle / Product

- [ ] Exponer datos para schema `Vehicle` cuando aplique.
- [ ] Exponer datos para schema `Product` como fallback comercial.
- [ ] Incluir marca, modelo, año, descripción, imagen y estado.
- [ ] Incluir identificadores históricos solo si están validados.
- [ ] Evitar datos estructurados en vehículos no publicados.

### Offer

- [ ] Exponer schema `Offer` para subastas activas.
- [ ] Incluir precio actual o precio base según disponibilidad.
- [ ] Incluir moneda, disponibilidad y fecha de finalización.
- [ ] Marcar subastas cerradas con estado coherente.
- [ ] Evitar declarar ofertas si la unidad no está disponible.

### BreadcrumbList

- [ ] Exponer estructura de breadcrumbs para vehículos.
- [ ] Exponer estructura de breadcrumbs para subastas.
- [ ] Exponer estructura por país, categoría, marca y modelo.
- [ ] Mantener nombres legibles y URLs canónicas.

### Organization

- [ ] Exponer datos base de `Organization`.
- [ ] Incluir nombre comercial, URL, logo y redes oficiales.
- [ ] Centralizar configuración para evitar inconsistencias.
- [ ] Permitir actualización sin despliegues de código cuando sea posible.

---

## 5. Performance Backend

### Caché

- [ ] Cachear respuestas SEO públicas de vehículos publicados.
- [ ] Cachear páginas de marca, modelo, categoría y listados públicos.
- [ ] Invalidar caché al publicar, editar, pausar o finalizar una subasta.
- [ ] Definir TTL diferenciado para subastas activas y contenido evergreen.
- [ ] Usar Redis para datos de alta rotación cuando corresponda.

### Respuesta API

- [ ] Mantener respuestas SEO públicas por debajo del objetivo de latencia definido.
- [ ] Implementar compresión HTTP para JSON y documentos XML.
- [ ] Evitar payloads excesivos en listados.
- [ ] Implementar paginación estable para marketplace y taxonomías.
- [ ] Exponer solo campos necesarios para render SEO.

### Multimedia y CDN

- [ ] Guardar metadatos de imágenes: ancho, alto, formato, peso y texto alternativo sugerido.
- [ ] Integrar URLs de CDN para imágenes públicas.
- [ ] Definir imagen destacada obligatoria para fichas indexables.
- [ ] Validar que imágenes privadas no se expongan en endpoints SEO.
- [ ] Proveer variantes optimizadas para frontend.

---

## 6. Seguridad SEO y Calidad de Indexación

### Contenido Duplicado

- [ ] Detectar fichas duplicadas por marca, modelo, año y número de identificación validado.
- [ ] Consolidar canónicas para URLs equivalentes.
- [ ] Evitar indexar combinaciones de filtros sin valor SEO.
- [ ] Normalizar mayúsculas, acentos y parámetros en URLs.

### Estados HTTP

- [ ] Devolver 404 real para vehículos inexistentes o no publicados.
- [ ] Devolver 410 para contenido eliminado definitivamente cuando aplique.
- [ ] Evitar 200 en páginas vacías o sin contenido indexable.
- [ ] Usar 301 para cambios permanentes de slug.
- [ ] Usar 302 solo para redirecciones temporales.

### Rutas Privadas

- [ ] Bloquear indexación de login, registro y recuperación de contraseña.
- [ ] Bloquear indexación de panel administrativo.
- [ ] Bloquear indexación de historial privado de compras y ventas.
- [ ] Bloquear indexación de chats, pagos, facturación y garantías.
- [ ] Evitar exposición de datos personales en endpoints públicos.

---

## 7. Métricas y Monitoreo SEO

- [ ] Registrar errores 404 públicos relevantes.
- [ ] Registrar cambios de slug y uso de redirects.
- [ ] Monitorear generación de sitemap.
- [ ] Monitorear latencia de endpoints SEO críticos.
- [ ] Detectar URLs indexables sin metadata completa.
- [ ] Detectar vehículos publicados sin imagen destacada.
- [ ] Detectar páginas con contenido insuficiente.

---

## 8. Criterios de Aceptación Backend

- [ ] Todo contenido público indexable debe exponer metadata completa.
- [ ] Ninguna ruta privada debe aparecer en sitemap ni endpoints SEO.
- [ ] Toda ficha pública debe tener URL canónica estable.
- [ ] Los datos estructurados deben generarse solo con información válida.
- [ ] Los listados deben tener paginación y canonical coherentes.
- [ ] Las respuestas públicas deben evitar datos sensibles.
- [ ] El backend debe soportar el render SEO del frontend sin lógica duplicada.
