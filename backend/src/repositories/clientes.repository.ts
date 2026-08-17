import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearClienteDto } from '../clientes/dto/crear-cliente.dto';
import { ActualizarClienteDto } from '../clientes/dto/actualizar-cliente.dto';
import { Cliente } from '@prisma/client';
import { ClienteConInmuebles } from '../common/types/prisma-relations.types';

const INCLUDE_INMUEBLES = {
  inmuebles: {
    include: { inmueble: true },
  },
} as const;

@Injectable()
export class ClientesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ClienteConInmuebles[]> {
    return this.prisma.cliente.findMany({ include: INCLUDE_INMUEBLES });
  }

  async findById(id: string): Promise<ClienteConInmuebles | null> {
    return this.prisma.cliente.findUnique({
      where: { id },
      include: INCLUDE_INMUEBLES,
    });
  }

  async findByCi(ci: string): Promise<Cliente | null> {
    return this.prisma.cliente.findUnique({ where: { ci } });
  }

  async create(data: CrearClienteDto): Promise<ClienteConInmuebles> {
    return this.prisma.cliente.create({
      data,
      include: INCLUDE_INMUEBLES,
    });
  }

  async update(
    id: string,
    data: ActualizarClienteDto,
  ): Promise<ClienteConInmuebles> {
    return this.prisma.cliente.update({
      where: { id },
      data,
      include: INCLUDE_INMUEBLES,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cliente.delete({ where: { id } });
  }
}
