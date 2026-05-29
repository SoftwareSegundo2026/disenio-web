# SEO Frontend — Heritage Motors Auctions

## Rol SEO del Proyecto

Como SEO del proyecto, el frontend debe transformar los datos del backend en páginas claras, rápidas, semánticas y persuasivas para usuarios y motores de búsqueda. Este backlog organiza las tareas on-page, técnicas y de contenido para posicionar **Heritage Motors Auctions** como referencia regional en subastas de automotores clásicos y de época.

---

## 1. Estructura SEO por Pantalla

### Landing

- [ ] Crear un `h1` único orientado a subastas de automotores clásicos y de época.
- [ ] Comunicar propuesta de valor premium en el primer bloque visible.
- [ ] Incluir enlaces internos hacia marketplace, subastas activas, marcas y contenido histórico.
- [ ] Mostrar señales de confianza: validación, autenticidad, trazabilidad y seguridad.
- [ ] Incluir sección editorial breve para explicar el valor de los vehículos clásicos.
- [ ] Incorporar CTA principal para explorar subastas.
- [ ] Incorporar CTA secundario para publicar un vehículo.

### Marketplace

- [ ] Crear título visible y metadata para marketplace de vehículos clásicos.
- [ ] Renderizar contenido indexable antes de componentes interactivos pesados.
- [ ] Mostrar cards con marca, modelo, año, ubicación, estado y precio relevante.
- [ ] Incluir enlaces rastreables a fichas de vehículos.
- [ ] Implementar paginación con enlaces accesibles.
- [ ] Evitar que filtros no indexables generen páginas duplicadas.
- [ ] Añadir texto introductorio SEO para categorías principales.

### Detalle de Vehículo

- [ ] Crear `h1` con marca, modelo y año.
- [ ] Mostrar resumen histórico y comercial en el primer bloque de contenido.
- [ ] Renderizar ficha técnica con HTML semántico.
- [ ] Incluir galería optimizada con imagen prioritaria.
- [ ] Mostrar certificados y documentación validada si existen.
- [ ] Incluir breadcrumbs hacia inicio, marketplace, marca y modelo.
- [ ] Agregar enlaces internos a vehículos similares y subastas relacionadas.

### Subasta

- [ ] Crear `h1` con vehículo y contexto de subasta.
- [ ] Mostrar estado de subasta de forma visible y accesible.
- [ ] Incluir fecha de inicio, fecha de cierre y puja actual.
- [ ] Separar información indexable de interacciones privadas o transaccionales.
- [ ] Renderizar contenido útil para subastas finalizadas.
- [ ] Agregar enlaces a ficha del vehículo, marca, modelo y subastas similares.
- [ ] Evitar que datos sensibles de pujas se impriman en HTML público.

### Blog y Contenido Editorial

- [ ] Crear estructura para artículos históricos y guías de compra.
- [ ] Usar un `h1` único por artículo.
- [ ] Organizar contenido con `h2` y `h3` descriptivos.
- [ ] Incluir autor, fecha de publicación y fecha de actualización.
- [ ] Enlazar artículos con vehículos, marcas, modelos y subastas activas.
- [ ] Crear contenidos evergreen por región, época, marca y tipo de vehículo.

---

## 2. Metadata On-Page

### Titles y Descriptions

- [ ] Consumir title dinámico provisto por backend cuando exista.
- [ ] Consumir meta description dinámica provista por backend cuando exista.
- [ ] Definir fallbacks por tipo de página.
- [ ] Evitar titles duplicados entre páginas similares.
- [ ] Evitar descriptions genéricas en fichas de vehículos.
- [ ] Verificar longitud visual aproximada antes de publicar.

### Canonicals

- [ ] Renderizar canonical en páginas indexables.
- [ ] Usar canonical provisto por backend.
- [ ] Evitar canonical en rutas privadas.
- [ ] Evitar canonical hacia URLs con parámetros de tracking.
- [ ] Validar canonical en paginaciones y filtros indexables.

### Open Graph y Twitter Cards

- [ ] Renderizar `og:title` por página pública.
- [ ] Renderizar `og:description` por página pública.
- [ ] Renderizar `og:image` usando imagen destacada optimizada.
- [ ] Renderizar `og:url` con URL canónica.
- [ ] Renderizar `twitter:card` como `summary_large_image`.
- [ ] Usar imagen fallback institucional cuando no exista imagen propia.

---

## 3. HTML Semántico y Enlaces Internos

### Semántica

- [ ] Usar un solo `h1` por página.
- [ ] Ordenar headings sin saltos innecesarios.
- [ ] Usar `main`, `section`, `article`, `nav`, `header` y `footer` correctamente.
- [ ] Renderizar fichas técnicas con listas o tablas accesibles según corresponda.
- [ ] Evitar texto crítico dentro de imágenes.
- [ ] Garantizar que el contenido principal exista sin depender de modales.

### Breadcrumbs

- [ ] Mostrar breadcrumbs visibles en marketplace, vehículo, subasta y artículo.
- [ ] Enlazar cada nivel con URLs canónicas.
- [ ] Mantener nombres legibles para país, marca, modelo y categoría.
- [ ] Sincronizar breadcrumbs visuales con datos estructurados del backend.

### Enlaces Internos

- [ ] Enlazar desde landing hacia subastas activas.
- [ ] Enlazar desde landing hacia marcas destacadas.
- [ ] Enlazar desde vehículo hacia marca, modelo y época.
- [ ] Enlazar desde subasta hacia vehículo y similares.
- [ ] Enlazar desde artículos hacia fichas y subastas relevantes.
- [ ] Usar anchor text descriptivo en lugar de textos genéricos.

---

## 4. Imágenes y Multimedia

### Imágenes

- [ ] Usar imagen destacada prioritaria en fichas de vehículo y subasta.
- [ ] Definir `alt` descriptivo con marca, modelo, año y vista cuando aplique.
- [ ] Evitar `alt` redundante o lleno de keywords.
- [ ] Usar formatos modernos servidos por CDN.
- [ ] Definir dimensiones para prevenir layout shift.
- [ ] Aplicar lazy loading en imágenes no críticas.
- [ ] Optimizar thumbnails para cards de marketplace.

### Videos

- [ ] Cargar videos bajo demanda para no afectar LCP.
- [ ] Incluir título y descripción accesible.
- [ ] Usar poster optimizado.
- [ ] Evitar autoplay con sonido.
- [ ] Mantener contenido textual equivalente para indexación.

---

## 5. Core Web Vitals y Performance

### LCP

- [ ] Priorizar imagen hero de landing solo si aporta valor real.
- [ ] Priorizar imagen principal de vehículo y subasta.
- [ ] Evitar sliders pesados en el primer viewport.
- [ ] Reducir JavaScript inicial en páginas públicas.
- [ ] Renderizar contenido SEO crítico en servidor cuando sea posible.

### CLS

- [ ] Reservar espacio para imágenes, cards y banners.
- [ ] Evitar insertar CTAs o alertas encima del contenido ya renderizado.
- [ ] Definir tamaños de fuentes e imágenes desde el primer render.
- [ ] Evitar cambios bruscos por temporizadores de subasta.

### INP

- [ ] Mantener filtros de marketplace livianos.
- [ ] Dividir componentes interactivos pesados.
- [ ] Diferir widgets de chat, notificaciones y pujas cuando no sean críticos para SEO.
- [ ] Evitar bloqueos de interfaz durante actualizaciones de subasta.

### Carga Inicial

- [ ] Cargar fuentes con estrategia optimizada.
- [ ] Evitar dependencias visuales innecesarias en páginas públicas.
- [ ] Dividir código por ruta.
- [ ] Preconectar dominios críticos de CDN.
- [ ] Medir rendimiento en landing, marketplace, vehículo y subasta.

---

## 6. Checklist On-Page por Pantalla

### Landing

- [ ] Title único.
- [ ] Meta description comercial.
- [ ] `h1` claro.
- [ ] CTA principal visible.
- [ ] Enlaces a secciones indexables.
- [ ] Copy orientado a confianza y especialización.
- [ ] Imágenes optimizadas.

### Marketplace

- [ ] Title único.
- [ ] Description específica.
- [ ] Texto introductorio indexable.
- [ ] Cards con enlaces HTML rastreables.
- [ ] Paginación accesible.
- [ ] Filtros no indexables controlados.
- [ ] Breadcrumbs visibles.

### Vehículo

- [ ] Title con marca, modelo y año.
- [ ] Description con valor histórico y comercial.
- [ ] `h1` único.
- [ ] Imagen destacada con `alt`.
- [ ] Ficha técnica completa.
- [ ] Breadcrumbs visibles.
- [ ] Enlaces internos a relacionados.

### Subasta

- [ ] Title con vehículo y estado de subasta.
- [ ] Description con fecha, puja y propuesta de valor.
- [ ] Estado visible y accesible.
- [ ] Contenido útil aunque la subasta haya terminado.
- [ ] CTA de puja separado del contenido indexable.
- [ ] Breadcrumbs visibles.
- [ ] Enlaces a similares.

### Blog / Editorial

- [ ] Title orientado a búsqueda informativa.
- [ ] Description editorial.
- [ ] Autor y fecha visibles.
- [ ] Índice interno si el artículo es extenso.
- [ ] Enlaces a vehículos, marcas y subastas.
- [ ] Imágenes con `alt` contextual.
- [ ] CTA hacia marketplace o publicación de vehículo.

---

## 7. Estrategia de Contenido Regional

### Argentina

- [ ] Crear landing o contenido para subastas de autos clásicos en Argentina.
- [ ] Incluir términos regionales: autos clásicos, autos de colección, vehículos antiguos.
- [ ] Cubrir marcas, clubes, restauradores y eventos locales cuando aplique.
- [ ] Enlazar vehículos disponibles en Argentina.

### Uruguay

- [ ] Crear contenido para compradores y vendedores uruguayos.
- [ ] Incluir contexto de importación, conservación y mercado regional cuando esté validado.
- [ ] Enlazar subastas y vehículos ubicados en Uruguay.
- [ ] Adaptar copy a búsquedas locales sin duplicar contenido argentino.

### Chile

- [ ] Crear contenido orientado a autos clásicos y de colección en Chile.
- [ ] Incluir referencias regionales relevantes cuando sean verificadas.
- [ ] Enlazar marcas y modelos con demanda local.
- [ ] Evitar páginas vacías si no hay inventario suficiente.

### Brasil

- [ ] Crear contenido SEO en español inicialmente, con posibilidad futura de portugués.
- [ ] Identificar marcas, modelos y términos de búsqueda relevantes para Brasil.
- [ ] Enlazar vehículos brasileños o con interés regional.
- [ ] Preparar estructura para futura internacionalización.

---

## 8. Accesibilidad con Impacto SEO

- [ ] Garantizar navegación por teclado en páginas públicas.
- [ ] Usar labels claros en filtros y formularios.
- [ ] Mantener contraste suficiente en CTAs y textos.
- [ ] Evitar contenido crítico solo visible por hover.
- [ ] Describir estados de subasta para lectores de pantalla.
- [ ] Usar textos de enlace descriptivos.
- [ ] Mantener foco visible en interacciones importantes.

---

## 9. Criterios de Aceptación Frontend

- [ ] Cada página pública debe tener title, description y canonical cuando corresponda.
- [ ] Cada página indexable debe tener un `h1` único.
- [ ] El contenido principal debe ser visible y rastreable en HTML.
- [ ] Las imágenes críticas deben tener dimensiones, formato optimizado y `alt`.
- [ ] La navegación interna debe conectar landing, marketplace, vehículos, subastas y contenido editorial.
- [ ] Las páginas privadas no deben renderizar metadata indexable.
- [ ] Las métricas Core Web Vitals deben revisarse en las páginas públicas críticas.

# Plataforma de Subastas de Automotores Clásicos y de Época

## Documento Estratégico y Operativo para Equipo de Desarrollo

---

# 1. Visión General del Proyecto

## Nombre Tentativo

**Heritage Motors Auctions**

## Descripción

Plataforma web especializada en subastas online de automotores clásicos y de época fabricados entre 1900 y 1980.

El sistema permitirá:

* Publicar vehículos históricos
* Gestionar subastas en tiempo real
* Validar autenticidad de vehículos
* Gestionar compradores y vendedores
* Realizar pujas seguras
* Administrar documentación histórica
* Generar reputación y trazabilidad

---

# 2. Objetivo Comercial

Crear una plataforma premium orientada a coleccionistas, restauradores, inversionistas y amantes de automóviles históricos.

## Objetivos principales

* Convertirse en referencia regional de subastas de vehículos clásicos
* Garantizar transparencia y autenticidad
* Crear una comunidad especializada
* Monetizar mediante:
  * comisión por venta
  * membresías premium
  * publicaciones destacadas
  * certificaciones
  * eventos privados

---

# 3. Público Objetivo

## Segmentos

* Coleccionistas privados
* Museos automotrices
* Restauradores
* Casas de subastas
* Inversionistas
* Fanáticos del automovilismo histórico

## Regiones iniciales

* Argentina
* Uruguay
* Chile
* Brasil

## Escalabilidad futura

* Europa
* Estados Unidos

---

# 4. Funcionalidades Principales

## Módulo de Usuarios

* Registro/Login
* Roles y permisos
* Perfil público
* Historial de compras y ventas
* Sistema de reputación

## Módulo de Vehículos

* Alta de vehículos
* Ficha técnica histórica
* Fotografías HD
* Videos
* Certificados
* Estado de restauración
* Historial de propietarios

## Módulo de Subastas

* Subastas programadas
* Temporizador en tiempo real
* Puja automática
* Notificaciones
* Extensión automática por puja tardía

## Módulo Administrativo

* Validación de publicaciones
* Moderación
* Gestión financiera
* Gestión de usuarios
* Métricas

## Módulo Financiero

* Pasarela de pagos
* Comisiones
* Facturación
* Gestión de garantías

## Módulo de Comunicación

* Chat comprador/vendedor
* Notificaciones push
* Email transaccional

---

# 5. Stack Tecnológico Sugerido

## Frontend

* Next.js
* React
* TypeScript
* TailwindCSS

## Backend

* FastAPI o NestJS
* PostgreSQL
* Redis
* WebSockets

## Infraestructura

* Docker
* Nginx
* CI/CD
* GitHub Actions

## Cloud

* AWS / DigitalOcean / Azure

## Multimedia

* Cloudinary
* S3

---

# 6. Arquitectura General

## Arquitectura Recomendada

Arquitectura modular basada en servicios.

## Componentes

* Frontend Web
* API Backend
* Servicio de autenticación
* Servicio de subastas en tiempo real
* Servicio multimedia
* Servicio financiero
* Servicio de notificaciones

---

# 7. Roles del Equipo de Desarrollo

---

## 1. Líder Técnico / Arquitecto de Software

### Responsabilidades

* Diseñar arquitectura
* Definir estándares
* Supervisar calidad técnica
* Coordinar integraciones
* Revisar código crítico

### Tecnologías

* Arquitectura backend
* Seguridad
* DevOps
* Escalabilidad

### Entregables

* Arquitectura técnica
* Diagramas
* Definiciones API
* Estándares técnicos

---

## 2. Desarrollador Backend

### Responsabilidades

* Desarrollo de APIs
* Seguridad
* Gestión de base de datos
* Lógica de subastas
* Integraciones externas

### Tecnologías

* FastAPI / NestJS
* PostgreSQL
* Redis

### Entregables

* APIs REST
* WebSockets
* Integraciones

---

## 3. Desarrollador Frontend

### Responsabilidades

* Interfaces
* Experiencia de usuario
* Responsive design
* Integración con APIs

### Tecnologías

* Next.js
* React
* TailwindCSS

### Entregables

* Panel administrativo
* Marketplace
* Sistema de subastas

---

## 4. Diseñador UX/UI

### Responsabilidades

* Diseño visual
* Branding
* Experiencia premium
* Wireframes

### Entregables

* Sistema de diseño
* Prototipos
* Mockups

---

## 5. DevOps / Infraestructura

### Responsabilidades

* Deploy
* Seguridad cloud
* Monitoreo
* CI/CD

### Tecnologías

* Docker
* Linux
* Nginx
* GitHub Actions

### Entregables

* Pipelines
* Infraestructura
* Backups

---

# 8. Roles Opcionales Recomendados

## QA Tester

* Testing funcional
* Automatización
* Stress testing

## Product Owner

* Priorización funcional
* Roadmap
* Requerimientos

## Especialista en Seguridad

* Auditorías
* Protección antifraude
* Pentesting

---

# 9. Metodología de Trabajo

## Metodología Recomendada

SCRUM

## Sprint

* Duración: 2 semanas

## Ceremonias

* Daily
* Sprint Planning
* Sprint Review
* Retrospective

## Herramientas

* Jira
* Trello
* Notion
* Slack
* Discord

---

# 10. Normas y Reglas de Desarrollo

## Código

* Clean Code
* SOLID
* DRY
* KISS

## Git

### Branches

* main
* develop
* feature/*
* hotfix/*

## Pull Requests

* Revisión obligatoria
* Testing obligatorio
* Sin merge directo a main

---

# 11. Seguridad

## Requisitos

* JWT
* MFA
* Rate limiting
* Logs
* Encriptación

## Protección

* Anti bots
* Anti fraude
* Protección de pujas falsas

---

# 12. Roadmap Inicial

## Fase 1 — MVP

* Registro/Login
* Publicación de vehículos
* Subastas simples
* Panel admin

## Fase 2

* Chat
* Reputación
* Notificaciones

## Fase 3

* App mobile
* Streaming en vivo
* IA para valuaciones

---

# 13. Checklist Técnico Inicial

## Infraestructura

* [ ] Repositorios
* [ ] Docker
* [ ] CI/CD
* [ ] SSL

## Backend

* [ ] Autenticación
* [ ] Roles
* [ ] API vehículos
* [ ] API subastas

## Frontend

* [ ] Landing
* [ ] Marketplace
* [ ] Sistema de pujas

## Seguridad

* [ ] Backups
* [ ] Logs
* [ ] Validaciones

---

# 14. KPIs del Proyecto

## Técnicos

* Tiempo de respuesta API
* Disponibilidad
* Errores por release

## Comerciales

* Vehículos publicados
* Subastas exitosas
* Usuarios activos
* Ticket promedio

---

# 15. Escalabilidad Futura

## Funcionalidades futuras

* Blockchain para autenticidad
* NFTs históricos
* Marketplace de repuestos
* Streaming de subastas
* IA de valuación

---

# 16. Cultura del Equipo

## Valores

* Calidad
* Transparencia
* Innovación
* Seguridad
* Escalabilidad

## Objetivo

Construir la plataforma de referencia en subastas históricas automotrices de Latinoamérica.

---
