import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolUsuario } from '@prisma/client';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { UsuarioSinPassword } from './usuarios.types';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(
    @Body() crearUsuarioDto: CrearUsuarioDto,
  ): Promise<UsuarioSinPassword> {
    return this.usuariosService.create(crearUsuarioDto);
  }

  @Get()
  findAll(): Promise<UsuarioSinPassword[]> {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<UsuarioSinPassword> {
    return this.usuariosService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() actualizarUsuarioDto: ActualizarUsuarioDto,
  ): Promise<UsuarioSinPassword> {
    return this.usuariosService.update(id, actualizarUsuarioDto);
  }
}
