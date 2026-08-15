# Diccionario de Datos

## Tabla: `clientes`

Directorio maestro de clientes.

| Columna    | Tipo     | Nullable | Relación | Descripción                  |
| ---------- | -------- | -------- | -------- | ---------------------------- |
| id         | String   | No       |          | Identificador único (UUID).  |
| nombres    | String   | No       |          | Nombres del cliente.         |
| apellidos  | String   | No       |          | Apellidos del cliente.       |
| ci         | String   | No       |          | Cédula de identidad (único). |
| email      | String   | Sí       |          | Correo electrónico.          |
| telefono   | String   | Sí       |          | Teléfono de contacto.        |
| direccion  | String   | Sí       |          | Dirección.                   |
| created_at | DateTime | No       |          | Fecha de creación.           |
| updated_at | DateTime | No       |          | Fecha de actualización.      |

## Tabla: `inmuebles`

Inmuebles registrados en el sistema.

| Columna          | Tipo     | Nullable | Relación | Descripción                 |
| ---------------- | -------- | -------- | -------- | --------------------------- |
| id               | String   | No       |          | Identificador único (UUID). |
| matricula        | String   | Sí       |          | Matrícula del inmueble.     |
| codigo_catastral | String   | Sí       |          | Código catastral.           |
| direccion        | String   | No       |          | Dirección del inmueble.     |
| superficie       | Decimal  | Sí       |          | Superficie en m2.           |
| descripcion      | String   | Sí       |          | Descripción.                |
| created_at       | DateTime | No       |          | Fecha de creación.          |
| updated_at       | DateTime | No       |          | Fecha de actualización.     |

## Tabla: `cliente_inmueble`

Relación muchos-a-muchos entre clientes e inmuebles.

| Columna     | Tipo     | Nullable | Relación         | Descripción                                        |
| ----------- | -------- | -------- | ---------------- | -------------------------------------------------- |
| cliente_id  | String   | No       | FK a `clientes`  | ID del cliente.                                    |
| inmueble_id | String   | No       | FK a `inmuebles` | ID del inmueble.                                   |
| rol         | Enum     | No       |                  | Rol del cliente en el inmueble (PROPIETARIO, etc). |
| created_at  | DateTime | No       |                  | Fecha de creación.                                 |

## Tabla: `usuarios`

Usuarios del sistema con acceso (RBAC).

| Columna       | Tipo     | Nullable | Relación | Descripción                            |
| ------------- | -------- | -------- | -------- | -------------------------------------- |
| id            | String   | No       |          | Identificador único (UUID).            |
| email         | String   | No       |          | Correo del usuario.                    |
| password_hash | String   | No       |          | Hash de contraseña.                    |
| nombre        | String   | No       |          | Nombre del usuario.                    |
| apellido      | String   | No       |          | Apellido del usuario.                  |
| rol           | Enum     | No       |          | Rol del usuario (ADMIN, ABOGADO, etc). |
| activo        | Boolean  | No       |          | Estado activo/inactivo.                |
| created_at    | DateTime | No       |          | Fecha de creación.                     |
| updated_at    | DateTime | No       |          | Fecha de actualización.                |

## Tabla: `tipos_tramite`

Tipos de trámites disponibles en el sistema.

| Columna     | Tipo     | Nullable | Relación | Descripción                 |
| ----------- | -------- | -------- | -------- | --------------------------- |
| id          | String   | No       |          | Identificador único (UUID). |
| nombre      | String   | No       |          | Nombre del tipo de trámite. |
| area        | Enum     | No       |          | Área legal o técnica.       |
| descripcion | String   | Sí       |          | Descripción opcional.       |
| created_at  | DateTime | No       |          | Fecha de creación.          |
| updated_at  | DateTime | No       |          | Fecha de actualización.     |

## Tabla: `pasos_tipo_tramite`

Pasos configurables para el motor de estados de cada tipo de trámite.

| Columna            | Tipo     | Nullable | Relación             | Descripción                              |
| ------------------ | -------- | -------- | -------------------- | ---------------------------------------- |
| id                 | String   | No       |                      | Identificador único (UUID).              |
| tipo_tramite_id    | String   | No       | FK a `tipos_tramite` | ID del tipo de trámite.                  |
| nombre_estado      | String   | No       |                      | Nombre del estado en este paso.          |
| orden              | Int      | No       |                      | Orden del paso en el flujo.              |
| requiere_documento | Boolean  | No       |                      | Indica si el paso exige subir documento. |
| created_at         | DateTime | No       |                      | Fecha de creación.                       |
| updated_at         | DateTime | No       |                      | Fecha de actualización.                  |

## Tabla: `tramites`

Instancias de trámites asociados a inmuebles.

| Columna         | Tipo     | Nullable | Relación             | Descripción                                  |
| --------------- | -------- | -------- | -------------------- | -------------------------------------------- |
| id              | String   | No       |                      | Identificador único (UUID).                  |
| inmueble_id     | String   | No       | FK a `inmuebles`     | ID del inmueble al que pertenece el trámite. |
| tipo_tramite_id | String   | No       | FK a `tipos_tramite` | ID del tipo de trámite.                      |
| estado_actual   | String   | No       |                      | Estado actual del trámite.                   |
| motivo_bloqueo  | String   | Sí       |                      | Razón del bloqueo, si aplica.                |
| created_at      | DateTime | No       |                      | Fecha de inicio del trámite.                 |
| updated_at      | DateTime | No       |                      | Última fecha de actualización.               |

## Tabla: `historial_tramites`

Historial de cambios de estado de un trámite (motor de estados).

| Columna         | Tipo     | Nullable | Relación        | Descripción                    |
| --------------- | -------- | -------- | --------------- | ------------------------------ |
| id              | String   | No       |                 | Identificador único (UUID).    |
| tramite_id      | String   | No       | FK a `tramites` | ID del trámite.                |
| usuario_id      | String   | No       | FK a `usuarios` | Usuario que realizó el cambio. |
| estado_anterior | String   | Sí       |                 | Estado antes del cambio.       |
| estado_nuevo    | String   | No       |                 | Estado asignado.               |
| observacion     | String   | Sí       |                 | Nota u observación.            |
| fecha           | DateTime | No       |                 | Fecha del cambio.              |

## Tabla: `documentos_tramite`

Referencias a documentos subidos a Cloudinary.

| Columna        | Tipo     | Nullable | Relación        | Descripción                     |
| -------------- | -------- | -------- | --------------- | ------------------------------- |
| id             | String   | No       |                 | Identificador único (UUID).     |
| tramite_id     | String   | No       | FK a `tramites` | ID del trámite.                 |
| cloudinary_url | String   | No       |                 | URL de Cloudinary.              |
| tipo_documento | String   | No       |                 | Tipo o categoría del documento. |
| created_at     | DateTime | No       |                 | Fecha de subida.                |
