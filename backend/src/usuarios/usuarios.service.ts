import { Injectable } from '@nestjs/common';
import { Prisma, Usuario } from '@prisma/client';
import { UsuariosRepository } from './usuarios.repository';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { sinPassword, UsuarioSinPassword } from './usuarios.types';
import {
  UsuarioNotFoundError,
  UsuarioAlreadyExistsError,
} from '../common/errors/app.error';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(private readonly usuariosRepository: UsuariosRepository) {}

  async create(crearUsuarioDto: CrearUsuarioDto): Promise<UsuarioSinPassword> {
    const existing = await this.usuariosRepository.findByEmail(
      crearUsuarioDto.email,
    );
    if (existing) {
      throw new UsuarioAlreadyExistsError(crearUsuarioDto.email);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(crearUsuarioDto.password, salt);

    const usuario = await this.usuariosRepository.create({
      email: crearUsuarioDto.email,
      nombre: crearUsuarioDto.nombre,
      apellido: crearUsuarioDto.apellido,
      rol: crearUsuarioDto.rol,
      passwordHash,
    });

    return sinPassword(usuario);
  }

  async findAll(): Promise<UsuarioSinPassword[]> {
    const usuarios = await this.usuariosRepository.findAll();
    return usuarios.map((u) => sinPassword(u));
  }

  async findById(id: string): Promise<UsuarioSinPassword> {
    const usuario = await this.usuariosRepository.findById(id);
    if (!usuario) throw new UsuarioNotFoundError(id);
    return sinPassword(usuario);
  }

  async findByEmailForAuth(email: string): Promise<Usuario | null> {
    return this.usuariosRepository.findByEmail(email);
  }

  async update(
    id: string,
    actualizarUsuarioDto: ActualizarUsuarioDto,
  ): Promise<UsuarioSinPassword> {
    await this.findById(id);

    let passwordHash: string | undefined;
    if (actualizarUsuarioDto.password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(actualizarUsuarioDto.password, salt);
    }

    const dataToUpdate: Prisma.UsuarioUpdateInput = {
      nombre: actualizarUsuarioDto.nombre,
      apellido: actualizarUsuarioDto.apellido,
      rol: actualizarUsuarioDto.rol,
      activo: actualizarUsuarioDto.activo,
      passwordHash,
    };

    const updated = await this.usuariosRepository.update(id, dataToUpdate);
    return sinPassword(updated);
  }
}
