import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CrearTipoTramiteDto } from './crear-tipo-tramite.dto';

export class ActualizarTipoTramiteDto extends PartialType(
  OmitType(CrearTipoTramiteDto, ['pasos'] as const),
) {}
