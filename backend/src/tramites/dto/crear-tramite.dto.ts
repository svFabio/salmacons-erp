import { IsString, IsNotEmpty } from 'class-validator';

export class CrearTramiteDto {
  @IsString()
  @IsNotEmpty()
  inmuebleId: string;

  @IsString()
  @IsNotEmpty()
  tipoTramiteId: string;
}
