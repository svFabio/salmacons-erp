import { Usuario } from '@prisma/client';

export type UsuarioSinPassword = Omit<Usuario, 'passwordHash'>;

export function sinPassword(usuario: Usuario): UsuarioSinPassword {
  return {
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    rol: usuario.rol,
    activo: usuario.activo,
    createdAt: usuario.createdAt,
    updatedAt: usuario.updatedAt,
  };
}
