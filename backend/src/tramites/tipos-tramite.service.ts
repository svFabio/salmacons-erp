import { Injectable, NotFoundException } from '@nestjs/common';
import { TiposTramiteRepository } from '../repositories/tipos-tramite.repository';
import { TipoTramite } from '@prisma/client';
import { CrearTipoTramiteDto } from './dto/crear-tipo-tramite.dto';
import { ActualizarTipoTramiteDto } from './dto/actualizar-tipo-tramite.dto';

@Injectable()
export class TiposTramiteService {
  constructor(private readonly repository: TiposTramiteRepository) {}

  async findAll(): Promise<TipoTramite[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<TipoTramite> {
    const tipo = await this.repository.findById(id);
    if (!tipo) {
      throw new NotFoundException(`Tipo de trámite con ID ${id} no encontrado`);
    }
    return tipo;
  }

  async create(data: CrearTipoTramiteDto): Promise<TipoTramite> {
    return this.repository.create(data);
  }

  async update(
    id: string,
    data: ActualizarTipoTramiteDto,
  ): Promise<TipoTramite> {
    await this.findById(id); // Verificar existencia
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verificar existencia
    await this.repository.delete(id);
  }
}
