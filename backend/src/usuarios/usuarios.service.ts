import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UsuariosRepository } from './usuarios.repository';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(private readonly usuariosRepository: UsuariosRepository) {}

  async create(crearUsuarioDto: CrearUsuarioDto) {
    const existing = await this.usuariosRepository.findByEmail(crearUsuarioDto.email);
    if (existing) {
      throw new ConflictException('Email ya registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(crearUsuarioDto.password, salt);

    const { password, ...rest } = crearUsuarioDto;
    const usuario = await this.usuariosRepository.create({
      ...rest,
      passwordHash,
    });
    
    return this.excludePassword(usuario);
  }

  async findAll() {
    const usuarios = await this.usuariosRepository.findAll();
    return usuarios.map(u => this.excludePassword(u));
  }

  async findById(id: string) {
    const usuario = await this.usuariosRepository.findById(id);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return this.excludePassword(usuario);
  }

  async findByEmailForAuth(email: string) {
    return this.usuariosRepository.findByEmail(email);
  }

  async update(id: string, actualizarUsuarioDto: ActualizarUsuarioDto) {
    await this.findById(id);

    let passwordHash: string | undefined;
    if (actualizarUsuarioDto.password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(actualizarUsuarioDto.password, salt);
    }

    const { password, ...rest } = actualizarUsuarioDto;
    const dataToUpdate: any = { ...rest };
    if (passwordHash) {
      dataToUpdate.passwordHash = passwordHash;
    }

    const updated = await this.usuariosRepository.update(id, dataToUpdate);
    return this.excludePassword(updated);
  }

  private excludePassword(usuario: any) {
    const { passwordHash, ...userWithoutPassword } = usuario;
    return userWithoutPassword;
  }
}
