import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ClientesRepository } from '../repositories/clientes.repository';
import { CrearClienteDto } from './dto/crear-cliente.dto';
import { ActualizarClienteDto } from './dto/actualizar-cliente.dto';
import { Cliente } from '@prisma/client';

@Injectable()
export class ClientesService {
  constructor(private readonly clientesRepository: ClientesRepository) {}

  async findAll(): Promise<Cliente[]> {
    return this.clientesRepository.findAll();
  }

  async findById(id: string): Promise<Cliente> {
    const cliente = await this.clientesRepository.findById(id);
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async create(createClienteDto: CrearClienteDto): Promise<Cliente> {
    const existente = await this.clientesRepository.findByCi(createClienteDto.ci);
    if (existente) {
      throw new ConflictException(`Cliente con CI ${createClienteDto.ci} ya existe`);
    }
    return this.clientesRepository.create(createClienteDto);
  }

  async update(id: string, updateClienteDto: ActualizarClienteDto): Promise<Cliente> {
    await this.findById(id); // verifica si existe
    if (updateClienteDto.ci) {
      const existente = await this.clientesRepository.findByCi(updateClienteDto.ci);
      if (existente && existente.id !== id) {
        throw new ConflictException(`Cliente con CI ${updateClienteDto.ci} ya existe`);
      }
    }
    return this.clientesRepository.update(id, updateClienteDto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // verifica si existe
    await this.clientesRepository.delete(id);
  }
}
