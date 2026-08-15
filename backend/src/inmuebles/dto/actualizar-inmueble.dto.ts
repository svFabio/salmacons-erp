import { PartialType } from '@nestjs/mapped-types';
import { CrearInmuebleDto } from './crear-inmueble.dto';

export class ActualizarInmuebleDto extends PartialType(CrearInmuebleDto) {}
