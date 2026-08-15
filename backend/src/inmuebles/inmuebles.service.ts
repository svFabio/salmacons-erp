import { Injectable, NotFoundException } from '@nestjs/common';
import { InmueblesRepository } from '../repositories/inmuebles.repository';
import { CrearInmuebleDto } from './dto/crear-inmueble.dto';
import { ActualizarInmuebleDto } from './dto/actualizar-inmueble.dto';
import { Inmueble, ClienteInmueble, RolClienteInmueble } from '@prisma/client';

@Injectable()
export class InmueblesService {
  constructor(private readonly inmueblesRepository: InmueblesRepository) {}

  async findAll(): Promise<Inmueble[]> {
    return this.inmueblesRepository.findAll();
  }

  async findById(id: string): Promise<Inmueble> {
    const inmueble = await this.inmueblesRepository.findById(id);
    if (!inmueble) {
      throw new NotFoundException(`Inmueble con ID ${id} no encontrado`);
    }
    return inmueble;
  }

  async create(createInmuebleDto: CrearInmuebleDto): Promise<Inmueble> {
    return this.inmueblesRepository.create(createInmuebleDto);
  }

  async update(
    id: string,
    updateInmuebleDto: ActualizarInmuebleDto,
  ): Promise<Inmueble> {
    await this.findById(id);
    return this.inmueblesRepository.update(id, updateInmuebleDto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.inmueblesRepository.delete(id);
  }

  async asociarCliente(
    inmuebleId: string,
    clienteId: string,
    rol: RolClienteInmueble,
  ): Promise<ClienteInmueble> {
    await this.findById(inmuebleId);
    return this.inmueblesRepository.asociarCliente(inmuebleId, clienteId, rol);
  }
}
