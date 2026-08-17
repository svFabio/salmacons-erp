export interface Inmueble {
  id: string;
  direccion: string;
  matricula: string | null;
  codigoCatastral: string | null;
  superficie: number | null;
  descripcion: string | null;
  createdAt: string;
  updatedAt: string;
}
