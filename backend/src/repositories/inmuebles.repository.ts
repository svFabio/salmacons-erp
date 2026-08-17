import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClienteInmueble, RolClienteInmueble } from '@prisma/client';
import { CrearInmuebleDto } from '../inmuebles/dto/crear-inmueble.dto';
import { ActualizarInmuebleDto } from '../inmuebles/dto/actualizar-inmueble.dto';
import { InmuebleConClientes } from '../common/types/prisma-relations.types';

const INCLUDE_CLIENTES = {
  clientes: {
    include: { cliente: true },
  },
} as const;

@Injectable()
export class InmueblesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<InmuebleConClientes[]> {
    return this.prisma.inmueble.findMany({ include: INCLUDE_CLIENTES });
  }

  async findById(id: string): Promise<InmuebleConClientes | null> {
    return this.prisma.inmueble.findUnique({
      where: { id },
      include: INCLUDE_CLIENTES,
    });
  }

  async create(data: CrearInmuebleDto): Promise<InmuebleConClientes> {
    return this.prisma.inmueble.create({
      data,
      include: INCLUDE_CLIENTES,
    });
  }

  async update(
    id: string,
    data: ActualizarInmuebleDto,
  ): Promise<InmuebleConClientes> {
    return this.prisma.inmueble.update({
      where: { id },
      data,
      include: INCLUDE_CLIENTES,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.inmueble.delete({ where: { id } });
  }

  async asociarCliente(
    inmuebleId: string,
    clienteId: string,
    rol: RolClienteInmueble,
  ): Promise<ClienteInmueble> {
    return this.prisma.clienteInmueble.create({
      data: { inmuebleId, clienteId, rol },
    });
  }
}
