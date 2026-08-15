import { Injectable } from '@nestjs/common';
import { TramitesRepository } from './tramites.repository';
import { Tramite } from '@prisma/client';
import {
  InmuebleNotFoundError,
  TipoTramiteNoConfiguradoError,
} from '../common/errors/app.error';

@Injectable()
export class TramitesService {
  constructor(private readonly repository: TramitesRepository) {}

  async createTramite(
    data: { inmuebleId: string; tipoTramiteId: string },
    usuarioId: string,
  ): Promise<Tramite> {
    const inmuebleExists = await this.repository.checkInmuebleExists(
      data.inmuebleId,
    );
    if (!inmuebleExists) {
      throw new InmuebleNotFoundError(data.inmuebleId);
    }

    const pasoInicial = await this.repository.getFirstStateForTipoTramite(
      data.tipoTramiteId,
    );
    if (!pasoInicial) {
      throw new TipoTramiteNoConfiguradoError(data.tipoTramiteId);
    }

    const estadoInicial = pasoInicial.nombreEstado;

    const tramite = await this.repository.create({
      inmuebleId: data.inmuebleId,
      tipoTramiteId: data.tipoTramiteId,
      estadoActual: estadoInicial,
    });

    await this.repository.addHistorial({
      tramiteId: tramite.id,
      usuarioId,
      estadoAnterior: null,
      estadoNuevo: estadoInicial,
      observacion: 'Trámite inicializado',
    });

    return tramite;
  }
}
