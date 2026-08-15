# AGENTS-salma.md — Contrato de Agente IA para SALMA

> **Este archivo es la fuente de verdad.** Todo agente de IA (Claude Code, Cursor, Copilot Workspace, etc.) DEBE leerlo completo ANTES de escribir, refactorizar o revisar cualquier código de este repositorio.
> Si una instrucción de este archivo contradice una petición del usuario, este archivo gana, salvo que el usuario la anule EXPLÍCITAMENTE por escrito en la misma conversación.
> Si una decisión no está cubierta aquí, PARE y pregunte. No improvise.

---

## 1. Resumen del proyecto

**SALMA** es un sistema de gestión de trámites legales y técnicos de inmuebles para una constructora-consultora-legal: regularización de propiedades, aprobación de planos, inscripción en Derechos Reales y trámites municipales. NO es un ERP genérico: es un sistema de gestión de **casos/trámites** con portal multi-rol (Cliente, Abogado, Arquitecto, Admin), donde cada trámite pertenece a un inmueble y cada inmueble pertenece a uno o más clientes.

El sistema se construye 100% cloud desde el día 1 (Neon + Cloudinary + Render), pero con diseño extensible para poder incorporar en el futuro una base de datos local (red interna de oficina) sin reescritura mayor.

---

## 2. Stack técnico (NO cambiar sin autorización explícita)

| Capa | Tecnología | Propósito / Restricción |
|---|---|---|
| Backend | **NestJS** (Node.js + TypeScript) | API REST, validación, guards de RBAC |
| Frontend | **Angular** (TypeScript) | SPA multi-rol, portal del cliente |
| Base de datos | **PostgreSQL** gestionada en **Neon** | Única BD activa. Extensible a Postgres autoalojado — NO usar features propietarias sin equivalente estándar |
| ORM / acceso a datos | **Prisma** | Capa de repositorios obligatoria (o el que se defina en `/docs/decisions.md`); nunca queries dispersas |
| Archivos | **Cloudinary** | PDFs, planos, escaneos. NUNCA archivos binarios en PostgreSQL |
| Hosting | **Render** (principal). Respaldo: Railway/Fly.io (backend), Vercel (frontend) | Código desacoplado del proveedor para migración simple |
| Lenguaje | **TypeScript en todo el stack** | Tipos/interfaces compartidos entre backend y frontend cuando sea posible |

### Regla estricta de tipado — PROHIBIDO `any`

- **PROHIBIDO el uso de `any`** en cualquier parte del código TypeScript (backend o frontend).
- Todo dato debe tener un tipo, interfaz o DTO explícito.
- Si un tipo es genuinamente desconocido o dinámico: usar `unknown` y **validarlo/parsearlo** (con `zod`, `class-validator` o guard de tipo) ANTES de operar sobre él.
- `any` como atajo = incumplimiento grave. En revisión, se rechaza el cambio.

### Principio de extensibilidad hacia despliegue híbrido

1. NUNCA hardcodear la cadena de conexión a la BD. Siempre variables de entorno (`.env` / `process.env`), nunca en el código.
2. El acceso a datos vive SIEMPRE detrás de una capa de repositorios/servicios. Prohibido `prisma.queryRaw`/queries dispersas fuera de `repositories/`.
3. Evitar features exclusivas de Neon (extensiones, funciones, config) que no existan en PostgreSQL estándar autoalojado.
4. Toda decisión que dependa específicamente de Neon debe documentarse en `/docs/decisions.md` con una nota "Dependencia Neon" para identificarla y adaptarla fácil.

---

## 3. Arquitectura y modelo de datos (jerarquía central — NO romper)

```
Cliente
 └── Inmueble  (relación MUCHOS-A-MUCHOS vía tabla intermedia)
      └── Trámite
           ├── Estado actual + historial de estados
           ├── Motivo de bloqueo (cuando estado = "Observado" | "Documentos incompletos")
           └── Documentos (referencia a Cloudinary, NUNCA el archivo binario)
```

### Reglas no negociables de datos

- **Cliente ↔ Inmueble es MUCHOS-A-MUCHOS** vía tabla intermedia (`cliente_inmueble` o similar). NUNCA simplificar a 1 a 1. Un inmueble puede tener varios dueños (herencias); un cliente puede tener varios inmuebles.
- Todo trámite pertenece a un inmueble; todo inmueble a uno o más clientes. **Ningún trámite puede existir "suelto".**
- El motor de estados es **genérico y configurable por tipo de trámite** (~40 tipos: aprobación de plano, inscripción, regularización, municipales...). Una sola estructura de datos modela estados, transiciones y pasos configurados por tipo. PROHIBIDO crear una tabla por tipo de trámite.

### Estructura de módulos por dominio (NestJS)

```
src/
├── clientes/        ← módulo Cliente
├── inmuebles/       ← módulo Inmueble
├── tramites/        ← módulo Trámite + motor de seguimiento
├── documentos/      ← módulo Documentos (Cloudinary)
├── usuarios/        ← módulo Usuarios y Roles (RBAC)
├── auth/            ← autenticación
├── repositories/    ← capa de datos (única que toca Prisma)
├── common/          ← guards, decoradores, pipes, interceptores
│   └── guards/      ← RolesGuard, JwtAuthGuard
└── config/          ← env.ts, constantes
```

Regla de capas: Controller → Service → Repository → Prisma. Cada capa habla SOLO con la inmediata inferior. Un controller NUNCA importa un repository. Un repository NUNCA contiene lógica de negocio.

---

## 4. Épicas del sistema y su GOAL

| # | Épica | GOAL (para qué existe) |
|---|---|---|
| 1 | **Gestión de Clientes e Inmuebles** | Mantener el directorio maestro (clientes + inmuebles + relación M:N). Sin esto, ningún trámite tiene a qué colgarse. Alta/edición de clientes, inmuebles (matrícula, código catastral, dirección, superficie) y asociación M:N. |
| 2 | **Gestión Legal** | Espacio de trabajo del abogado para la parte jurídica de cada trámite, con registro de cada paso. Asignación de trámites legales, documentación legal, presentaciones ante entidades (Derechos Reales), observaciones legales y resolución, actualización de estado vía motor de seguimiento. Esta épica ESCRIBE el estado de trámites legales. |
| 3 | **Gestión Técnica** | Equivalente del abogado, pero para el arquitecto: parte técnica/constructiva. Flujos legal y técnico avanzan en paralelo sin pisarse. Planos versionados, mediciones/inspecciones, observaciones técnicas, actualización de estado vía motor. Esta épica ESCRIBE el estado de trámites técnicos. |
| 4 | **Seguimiento de Trámites** | Única fuente de verdad sobre "en qué estado está cada trámite y qué le falta", genérica para los ~40 tipos. Estados/transiciones válidas, % de avance, motivo de bloqueo, historial completo (quién/cuándo/por qué). Gestión Legal y Técnica disparan; esta épica modela, guarda y expone. |
| 5 | **Portal del Cliente** | Que el cliente entienda de un vistazo el avance de cada trámite sin llamar a la oficina. Inmuebles del cliente, trámites por inmueble, barra de progreso, estado en lenguaje claro, motivo de bloqueo, última actualización. SOLO LECTURA — el cliente nunca edita. |
| 6 | **Gestión de Usuarios y Roles** | Controlar quién entra y qué ve/hace cada quien. Usuarios internos + rol, autenticación, autorización en CADA endpoint del backend (no solo ocultar botones), asociación de usuarios a la cartera de casos que les corresponde ver. |

---

## 5. Convenciones de código

### Nombres de archivos (NestJS)

| Tipo | Convención | Ejemplo |
|---|---|---|
| Módulo | `camelCase.module.ts` | `tramites.module.ts` |
| Controller | `camelCase.controller.ts` | `tramites.controller.ts` |
| Service | `camelCase.service.ts` | `tramites.service.ts` |
| Repository | `camelCase.repository.ts` | `tramites.repository.ts` |
| DTO | `camelCase.dto.ts` (o `*.dto.ts`) | `crear-tramite.dto.ts` |
| Guard/Decorador | PascalCase | `RolesGuard.ts`, `@Roles()` |

### Identificadores

- Variables y funciones: `camelCase`
- Clases y tipos: `PascalCase`
- Constantes: `SCREAMING_SNAKE_CASE`
- Zod schemas: `NounSchema`
- Modelos Prisma: nombre del modelo tal cual

### Reglas generales de código

- `async/await` SIEMPRE. Prohibidos callbacks y cadenas `.then()` salvo casos inevitables.
- Toda función pública debe tener tipo de retorno explícito.
- Sin `console.log` en rutas de producción: usar el logger estructurado del framework.
- Sin errores tragados: todo `catch` re-lanza, registra, o devuelve un error tipado.
- Validación de requests SIEMPRE con `class-validator`/DTOs (o `zod` si se define), ANTES de llegar al controller.
- Errores de dominio: clases tipadas que extienden `AppError` (con `statusCode` y `code`), nunca errores crudos al cliente.
- Sin archivos muertos en la raíz; scripts en `scripts/`.

### TDD estricto (obligatorio)

Toda la lógica de dominio (services, repositories, controllers y, en general, cualquier módulo con comportamiento) se desarrolla con TDD estricto en tres fases:

1. **RED**: se escribe PRIMERO el test que falla, antes que el código de producción. El test debe fallar por la razón correcta: la funcionalidad aún no existe.
2. **GREEN**: se implementa el código mínimo necesario para que el test pase.
3. **REFACTOR**: se limpia y mejora la implementación manteniendo todos los tests en verde.

Reglas obligatorias:

- Ningún service, repository o controller se considera completo sin su test unitario (`*.spec.ts`) que cubra el comportamiento y los casos de error. Los tests viajan en el MISMO commit que el código que verifican.
- Tests unitarios: `pnpm run test` (jest, SIN base de datos viva — los servicios de acceso a datos se prueban con mocks para que la suite sea rápida y determinista).
- Tests de integración: `pnpm run test:e2e`.
- Cobertura: `pnpm run test:cov`. La nueva lógica de dominio no debe reducir la cobertura global del módulo que toca.
- **CI**: la suite completa (`pnpm run lint`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`) corre en GitHub Actions en cada push a `main` y en cada PR. Un PR con tests en rojo no se fusiona.

### Commits

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`
- Un commit = un cambio lógico (work unit). Tests y docs del cambio viajan con el código.
- Prohibido: "WIP", "fix stuff", "changes".
- Ramas: `feat/<slug>`, `fix/<slug>`, `refactor/<slug>`.
- Sin atribución de IA en commits (no añadir "Co-Authored-By" ni firmas de IA).

---

## 6. Reglas de negocio NO NEGOCIABLES

1. **Jerarquía de datos intacta**: Cliente ↔ Inmueble (M:N) → Trámite → Estado/historial/motivo/documentos. Ningún trámite suelto.
2. **RBAC obligatorio en el backend**: CADA endpoint valida el rol ANTES de ejecutar cualquier acción. La UI puede ocultar opciones, pero eso NUNCA sustituye la validación del servidor.
   - Cliente → ve solo sus inmuebles/trámites, SOLO LECTURA.
   - Abogado → trámites legales asignados: cambia estados, observaciones, documentos legales.
   - Arquitecto → trámites técnicos asignados: planos, observaciones técnicas, aprueba/rechaza aspectos técnicos.
   - Admin → todo: reasigna, gestiona usuarios, reportes globales.
3. **Estructura de Cloudinary generada por código** (nunca el usuario elige carpeta a mano):
   ```
   /clientes/{cliente_id}/inmuebles/{inmueble_id}/tramites/{tramite_id}/{nombre_archivo}
   ```
   Cada subida debe: (1) guardarse en Cloudinary con esa ruta, (2) registrarse en la tabla `documentos` con referencia al `tramite_id`, (3) etiquetarse con tags (`tipo:plano`, `tipo:certificado`, etc.) para búsquedas.
4. **Prohibido `any`** en todo el TypeScript (ver §2).
5. **Esquema de BD documentado o el cambio no está completo** (ver §7).
6. **Los archivos binarios nunca van a PostgreSQL** — solo la referencia a Cloudinary.

---

## 7. Documentación viva de la base de datos (OBLIGATORIO)

Cada vez que un cambio de código modifique el esquema (nueva tabla, columna, relación, índice, cambio de tipo), el MISMO commit DEBE actualizar:

1. **ERD** → `/docs/bd/erd.md` — diagrama entidad-relación actualizado (Mermaid embebido en Markdown, versionable como texto).
2. **Diccionario de datos** → `/docs/bd/diccionario-datos.md` — una entrada por tabla: nombre, propósito, y por cada columna: nombre, tipo, nullable, si es FK (y a qué tabla apunta), y descripción breve.

**Ningún cambio de esquema se considera completo sin estos dos archivos actualizados en la misma tarea.** Si el agente detecta que un cambio de esquema se hizo sin actualizar `/docs/bd/`, debe señalarlo y corregirlo antes de continuar.

---

## 8. Qué NO debe hacer la IA NUNCA

- ❌ Usar `SQLite` o cualquier BD distinta de PostgreSQL/Neon (sin autorización explícita).
- ❌ Guardar archivos binarios (PDF, planos, escaneos) en PostgreSQL.
- ❌ Exponer un endpoint sin validar rol en el backend.
- ❌ Crear carpetas en Cloudinary manualmente o dejar que el usuario elija la ruta.
- ❌ Romper la relación muchos-a-muchos Cliente–Inmueble (simplificar a 1:1 o 1:N).
- ❌ Usar `any` en TypeScript.
- ❌ Escribir lógica de dominio (services, repositories, controllers) sin escribir primero el test que falla (TDD estricto, ver §5).
- ❌ Modificar el esquema de BD sin actualizar `/docs/bd/erd.md` y `/docs/bd/diccionario-datos.md`.
- ❌ Hardcodear credenciales, tokens o cadenas de conexión en el código (siempre `.env`, nunca committear `.env` real).
- ❌ Crear una tabla por tipo de trámite — el motor de estados es genérico y configurable.
- ❌ Dejar trámites sin inmueble o inmuebles sin cliente.
- ❌ Registrar errores crudos (stack traces, rutas internas) en respuestas HTTP al cliente.
- ❌ Cambiar el stack (NestJS/Angular/Neon/Cloudinary/Render) sin autorización explícita.
- ❌ Escribir código que dependa de particularidades exclusivas de Neon sin documentarlo como "Dependencia Neon".

---

## 9. Comandos del proyecto

> Placeholders — completar cuando el repo esté armado.

### Backend (NestJS)

```bash
cd backend
pnpm install
pnpm run start:dev      # servidor de desarrollo
pnpm run build          # compilar
pnpm run test           # tests unitarios
pnpm run test:e2e       # tests de integración
pnpm run lint           # lint
pnpm run migration:run  # aplicar migraciones
pnpm run migration:generate --name=nombre  # generar migración
npx prisma studio       # inspección visual de datos
```

### Frontend (Angular)

```bash
cd frontend
pnpm install
pnpm run start           # ng serve
pnpm run build           # compilación de producción
pnpm run test            # tests unitarios (Karma/Jest)
pnpm run lint            # lint
```

---

## 10. Cómo pedir aclaración (PARE y pregunte)

1. Si una tarea no está clara, está incompleta, o contradice este documento → **PARE inmediatamente** y pregunte al usuario antes de asumir o inventar.
2. Si una decisión de arquitectura no está cubierta aquí (nueva dependencia, nuevo patrón, duda de modelado) → pregunte y, si se resuelve, regístrela en `/docs/decisions.md`.
3. No improvise reglas de negocio: si un estado de trámite, una transición o un permiso no está definido, pregunte.
4. Antes de declarar una tarea "completa", verifique contra este documento: jerarquía intacta, RBAC en backend, documentación de BD actualizada, sin `any`, sin credenciales en código, convenciones de commit respetadas.
