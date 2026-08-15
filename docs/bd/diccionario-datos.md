# Diccionario de Datos — SALMA

> Actualizado: 2026-08-14 | Migración: `20260815033841_init`

---

## Tabla: `clientes`

Directorio maestro de personas físicas o jurídicas que tienen uno o más inmuebles en el sistema.

| Columna | Tipo | Nullable | Clave | Descripción |
|---|---|---|---|---|
| `id` | `uuid` | NO | PK | Identificador único (UUID v4) |
| `nombres` | `text` | NO | — | Nombre(s) del cliente |
| `apellidos` | `text` | NO | — | Apellido(s) del cliente |
| `ci` | `text` | NO | UK | Cédula de identidad (único en el sistema) |
| `email` | `text` | SÍ | UK | Correo electrónico (único si se provee) |
| `telefono` | `text` | SÍ | — | Número de teléfono de contacto |
| `direccion` | `text` | SÍ | — | Dirección del cliente (no del inmueble) |
| `created_at` | `timestamptz` | NO | — | Fecha/hora de creación del registro |
| `updated_at` | `timestamptz` | NO | — | Fecha/hora de última modificación |

---

## Tabla: `inmuebles`

Registro de propiedades que pueden tener uno o más clientes asociados y uno o más trámites activos.

| Columna | Tipo | Nullable | Clave | Descripción |
|---|---|---|---|---|
| `id` | `uuid` | NO | PK | Identificador único (UUID v4) |
| `matricula` | `text` | SÍ | UK | Número de matrícula del registro de propiedad |
| `codigo_catastral` | `text` | SÍ | UK | Código catastral municipal |
| `direccion` | `text` | NO | — | Dirección física del inmueble |
| `superficie` | `decimal(10,2)` | SÍ | — | Superficie en metros cuadrados |
| `descripcion` | `text` | SÍ | — | Descripción libre del inmueble |
| `created_at` | `timestamptz` | NO | — | Fecha/hora de creación del registro |
| `updated_at` | `timestamptz` | NO | — | Fecha/hora de última modificación |

---

## Tabla: `cliente_inmueble`

Tabla intermedia explícita para la relación muchos-a-muchos entre `clientes` e `inmuebles`.
Permite representar herencias, copropiedades y representaciones legales con el tipo de rol.

| Columna | Tipo | Nullable | Clave | Descripción |
|---|---|---|---|---|
| `cliente_id` | `uuid` | NO | PK, FK → `clientes.id` | Referencia al cliente |
| `inmueble_id` | `uuid` | NO | PK, FK → `inmuebles.id` | Referencia al inmueble |
| `rol` | `rol_cliente_inmueble` | NO | — | Rol del cliente: `PROPIETARIO`, `HEREDERO`, `REPRESENTANTE`, `COPROPIETARIO` |
| `created_at` | `timestamptz` | NO | — | Fecha de asociación |

> **Cascade**: si se elimina un `cliente` o un `inmueble`, se eliminan sus registros en esta tabla. No se eliminan el cliente ni el inmueble del otro lado.

---

## Enum: `rol_cliente_inmueble`

| Valor | Descripción |
|---|---|
| `PROPIETARIO` | Dueño legal único del inmueble |
| `HEREDERO` | Heredero en proceso sucesorio |
| `REPRESENTANTE` | Actúa en representación del propietario |
| `COPROPIETARIO` | Comparte la propiedad con otros clientes |
