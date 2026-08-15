import { Injectable } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { sinPassword } from '../usuarios/usuarios.types';
import { AuthUser, JwtPayload } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<AuthUser | null> {
    const user = await this.usuariosService.findByEmailForAuth(email);
    if (
      user &&
      user.activo &&
      (await bcrypt.compare(pass, user.passwordHash))
    ) {
      return sinPassword(user);
    }
    return null;
  }

  login(user: AuthUser): { access_token: string; user: AuthUser } {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
