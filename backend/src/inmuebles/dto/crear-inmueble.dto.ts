import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CrearInmuebleDto {
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @IsOptional()
  matricula?: string;

  @IsString()
  @IsOptional()
  codigoCatastral?: string;

  @IsNumber()
  @IsOptional()
  superficie?: number;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
