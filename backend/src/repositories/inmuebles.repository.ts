import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Inmueble, ClienteInmueble, RolClienteInmueble } from '@prisma/client';
import { CrearInmuebleDto } from '../inmuebles/dto/crear-inmueble.dto';
import { ActualizarInmuebleDto } from '../inmuebles/dto/actualizar-inmueble.dto';

@Injectable()
export class InmueblesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Inmueble[]> {
    return this.prisma.inmueble.findMany({
      include: { clientes: true },
    });
  }

  async findById(id: string): Promise<Inmueble | null> {
    return this.prisma.inmueble.findUnique({
      where: { id },
      include: { clientes: true },
    });
  }

  async create(data: CrearInmuebleDto): Promise<Inmueble> {
    return this.prisma.inmueble.create({ data });
  }

  async update(id: string, data: ActualizarInmuebleDto): Promise<Inmueble> {
    return this.prisma.inmueble.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.inmueble.delete({ where: { id } });
  }

  async asociarCliente(inmuebleId: string, clienteId: string, rol: RolClienteInmueble): Promise<ClienteInmueble> {
    return this.prisma.clienteInmueble.create({
      data: {
        inmuebleId,
        clienteId,
        rol,
      },
    });
  }
}
