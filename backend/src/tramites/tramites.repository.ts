import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tramite, HistorialTramite, PasoTipoTramite } from '@prisma/client';

@Injectable()
export class TramitesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async checkInmuebleExists(id: string): Promise<boolean> {
    const inmueble = await this.prisma.inmueble.findUnique({
      where: { id },
    });
    return !!inmueble;
  }

  async getFirstStateForTipoTramite(
    tipoTramiteId: string,
  ): Promise<PasoTipoTramite | null> {
    return this.prisma.pasoTipoTramite.findFirst({
      where: { tipoTramiteId },
      orderBy: { orden: 'asc' },
    });
  }

  async create(data: {
    inmuebleId: string;
    tipoTramiteId: string;
    estadoActual: string;
  }): Promise<Tramite> {
    return this.prisma.tramite.create({
      data,
    });
  }

  async addHistorial(data: {
    tramiteId: string;
    usuarioId: string;
    estadoAnterior: string | null;
    estadoNuevo: string;
    observacion?: string;
  }): Promise<HistorialTramite> {
    return this.prisma.historialTramite.create({
      data,
    });
  }
}
