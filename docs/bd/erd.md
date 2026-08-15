# ERD — SALMA Base de Datos

> Actualizado: 2026-08-14 | Migración: `20260815033841_init`

```mermaid
erDiagram
    CLIENTES {
        uuid id PK
        string nombres
        string apellidos
        string ci UK
        string email UK "nullable"
        string telefono "nullable"
        string direccion "nullable"
        timestamp created_at
        timestamp updated_at
    }

    INMUEBLES {
        uuid id PK
        string matricula UK "nullable"
        string codigo_catastral UK "nullable"
        string direccion
        decimal superficie "nullable, en m2"
        string descripcion "nullable"
        timestamp created_at
        timestamp updated_at
    }

    CLIENTE_INMUEBLE {
        uuid cliente_id PK,FK
        uuid inmueble_id PK,FK
        enum rol "PROPIETARIO|HEREDERO|REPRESENTANTE|COPROPIETARIO"
        timestamp created_at
    }

    USUARIOS {
        uuid id PK
        string email UK
        string password_hash
        string nombre
        string apellido
        enum rol "ADMIN|ABOGADO|ARQUITECTO|CLIENTE"
        boolean activo
        timestamp created_at
        timestamp updated_at
    }

    CLIENTES ||--o{ CLIENTE_INMUEBLE : "tiene"
    INMUEBLES ||--o{ CLIENTE_INMUEBLE : "pertenece a"
```

## Notas de diseño

- `CLIENTE_INMUEBLE` es tabla intermedia **explícita** (no implicit M:N de Prisma) para permitir atributos adicionales futuros como `porcentaje_propiedad`.
- La relación es muchos-a-muchos: un cliente puede tener varios inmuebles; un inmueble puede tener varios propietarios (herencias, copropiedades).
- `CASCADE` en `onDelete` para ambas FKs: si se elimina un cliente o inmueble, se elimina la asociación, no el otro lado.
