export type UserRole = 'ADMIN' | 'ABOGADO' | 'ARQUITECTO' | 'CLIENTE';

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: UserRole;
  activo: boolean;
}

export interface AuthResponse {
  access_token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
