export interface Cliente {
  id: string;
  nombres: string;
  apellidos: string;
  ci: string;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  createdAt: string;
  updatedAt: string;
}
