import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { RolUsuario } from "@prisma/client";
import { UseGuards } from "@nestjs/common";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InmueblesService } from './inmuebles.service';
import { CrearInmuebleDto } from './dto/crear-inmueble.dto';
import { ActualizarInmuebleDto } from './dto/actualizar-inmueble.dto';
import { Inmueble, ClienteInmueble, RolClienteInmueble } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.ABOGADO)
@Controller('inmuebles')
export class InmueblesController {
  constructor(private readonly inmueblesService: InmueblesService) {}

  @Post()
  async create(@Body() createInmuebleDto: CrearInmuebleDto): Promise<Inmueble> {
    return this.inmueblesService.create(createInmuebleDto);
  }

  @Get()
  async findAll(): Promise<Inmueble[]> {
    return this.inmueblesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Inmueble> {
    return this.inmueblesService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInmuebleDto: ActualizarInmuebleDto,
  ): Promise<Inmueble> {
    return this.inmueblesService.update(id, updateInmuebleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.inmueblesService.delete(id);
  }

  @Post(':id/clientes/:clienteId')
  async asociarCliente(
    @Param('id') id: string,
    @Param('clienteId') clienteId: string,
    @Body('rol') rol: RolClienteInmueble,
  ): Promise<ClienteInmueble> {
    return this.inmueblesService.asociarCliente(id, clienteId, rol);
  }
}
