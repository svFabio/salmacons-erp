import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { RolUsuario, Usuario } from '@prisma/client';
import { AuthUser } from './auth.types';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;

  const findByEmailForAuthMock = jest.fn();
  const signMock = jest.fn().mockReturnValue('token');

  const mockUsuario: Usuario = {
    id: '1',
    email: 'test@test.com',
    passwordHash: 'hash',
    nombre: 'Test',
    apellido: 'User',
    rol: RolUsuario.CLIENTE,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthUser: AuthUser = {
    id: '1',
    email: 'test@test.com',
    nombre: 'Test',
    apellido: 'User',
    rol: RolUsuario.CLIENTE,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsuariosService,
          useValue: { findByEmailForAuth: findByEmailForAuthMock },
        },
        {
          provide: JwtService,
          useValue: { sign: signMock },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return the user without passwordHash when credentials match', async () => {
      const passwordHash = await bcrypt.hash('secret', 10);
      findByEmailForAuthMock.mockResolvedValue({
        ...mockUsuario,
        passwordHash,
      });

      const result = await service.validateUser('test@test.com', 'secret');

      expect(result).not.toHaveProperty('passwordHash');
      expect(result?.id).toBe('1');
    });

    it('should return null when the user does not exist', async () => {
      findByEmailForAuthMock.mockResolvedValue(null);

      await expect(
        service.validateUser('test@test.com', 'secret'),
      ).resolves.toBeNull();
    });

    it('should return null when the password does not match', async () => {
      findByEmailForAuthMock.mockResolvedValue(mockUsuario);

      await expect(
        service.validateUser('test@test.com', 'wrong'),
      ).resolves.toBeNull();
    });

    it('should return null when the user is inactive', async () => {
      findByEmailForAuthMock.mockResolvedValue({
        ...mockUsuario,
        activo: false,
      });

      await expect(
        service.validateUser('test@test.com', 'secret'),
      ).resolves.toBeNull();
    });
  });

  describe('login', () => {
    it('should sign a JWT with the user payload', () => {
      const result = service.login(mockAuthUser);

      expect(signMock).toHaveBeenCalledWith({
        sub: '1',
        email: 'test@test.com',
        rol: RolUsuario.CLIENTE,
      });
      expect(result.access_token).toBe('token');
    });
  });
});
