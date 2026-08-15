import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cliente } from '@prisma/client';
import { CrearClienteDto } from '../clientes/dto/crear-cliente.dto';
import { ActualizarClienteDto } from '../clientes/dto/actualizar-cliente.dto';

@Injectable()
export class ClientesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Cliente[]> {
    return this.prisma.cliente.findMany();
  }

  async findById(id: string): Promise<Cliente | null> {
    return this.prisma.cliente.findUnique({ where: { id } });
  }

  async findByCi(ci: string): Promise<Cliente | null> {
    return this.prisma.cliente.findUnique({ where: { ci } });
  }

  async create(data: CrearClienteDto): Promise<Cliente> {
    return this.prisma.cliente.create({ data });
  }

  async update(id: string, data: ActualizarClienteDto): Promise<Cliente> {
    return this.prisma.cliente.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.cliente.delete({ where: { id } });
  }
}
