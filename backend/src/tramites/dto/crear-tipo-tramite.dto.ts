import {
  IsString,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AreaTramite } from '@prisma/client';

export class CrearPasoTipoTramiteDto {
  @IsString()
  nombreEstado: string;

  @IsInt()
  orden: number;

  @IsBoolean()
  @IsOptional()
  requiereDocumento?: boolean;
}

export class CrearTipoTramiteDto {
  @IsString()
  nombre: string;

  @IsEnum(AreaTramite)
  area: AreaTramite;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CrearPasoTipoTramiteDto)
  pasos?: CrearPasoTipoTramiteDto[];
}
