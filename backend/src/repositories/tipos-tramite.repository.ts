import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TipoTramite, Prisma } from '@prisma/client';
import { CrearTipoTramiteDto } from '../tramites/dto/crear-tipo-tramite.dto';
import { ActualizarTipoTramiteDto } from '../tramites/dto/actualizar-tipo-tramite.dto';

@Injectable()
export class TiposTramiteRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<TipoTramite[]> {
    return this.prisma.tipoTramite.findMany({
      include: { pasos: { orderBy: { orden: 'asc' } } },
    });
  }

  async findById(id: string): Promise<TipoTramite | null> {
    return this.prisma.tipoTramite.findUnique({
      where: { id },
      include: { pasos: { orderBy: { orden: 'asc' } } },
    });
  }

  async create(data: CrearTipoTramiteDto): Promise<TipoTramite> {
    const { pasos, ...rest } = data;
    const createData: Prisma.TipoTramiteCreateInput = {
      ...rest,
      ...(pasos && { pasos: { create: pasos } }),
    };
    return this.prisma.tipoTramite.create({
      data: createData,
      include: { pasos: { orderBy: { orden: 'asc' } } },
    });
  }

  async update(
    id: string,
    data: ActualizarTipoTramiteDto,
  ): Promise<TipoTramite> {
    return this.prisma.tipoTramite.update({
      where: { id },
      data,
      include: { pasos: { orderBy: { orden: 'asc' } } },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tipoTramite.delete({
      where: { id },
    });
  }
}
