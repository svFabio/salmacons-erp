import { RolUsuario } from '@prisma/client';
import { UsuarioSinPassword } from '../usuarios/usuarios.types';

export type AuthUser = UsuarioSinPassword;

export interface JwtPayload {
  sub: string;
  email: string;
  rol: RolUsuario;
}

export interface AuthenticatedRequest {
  user?: AuthUser;
}
