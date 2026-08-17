import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RolUsuario } from '@prisma/client';
import { UsuarioSinPassword } from './usuarios.types';
import {
  UsuarioNotFoundError,
  UsuarioAlreadyExistsError,
} from '../common/errors/app.error';

const mockUsuariosService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
};

describe('UsuariosController', () => {
  let controller: UsuariosController;

  const mockUser: UsuarioSinPassword = {
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
      controllers: [UsuariosController],
      providers: [{ provide: UsuariosService, useValue: mockUsuariosService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsuariosController>(UsuariosController);
  });

  describe('RBAC decorators', () => {
    it('should be protected with JwtAuthGuard and RolesGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        UsuariosController,
      ) as unknown[];
      expect(guards).toContain(JwtAuthGuard);
      expect(guards).toContain(RolesGuard);
    });

    it('should require ADMIN role at controller level', () => {
      const roles = Reflect.getMetadata(
        'roles',
        UsuariosController,
      ) as RolUsuario[];
      expect(roles).toEqual([RolUsuario.ADMIN]);
    });
  });

  describe('create', () => {
    it('should return the created user', async () => {
      mockUsuariosService.create.mockResolvedValue(mockUser);
      const result = await controller.create({
        email: 'new@test.com',
        password: 'secret123',
        nombre: 'Test',
        apellido: 'User',
        rol: RolUsuario.CLIENTE,
      });
      expect(result).toEqual(mockUser);
      expect(mockUsuariosService.create).toHaveBeenCalled();
    });

    it('should pass errors from service', async () => {
      const error = new UsuarioAlreadyExistsError('test@test.com');
      mockUsuariosService.create.mockRejectedValue(error);

      await expect(
        controller.create({
          email: 'test@test.com',
          password: '123',
          nombre: 'T',
          apellido: 'U',
          rol: RolUsuario.CLIENTE,
        }),
      ).rejects.toThrow(UsuarioAlreadyExistsError);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUsuariosService.findAll.mockResolvedValue([mockUser]);
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      mockUsuariosService.findById.mockResolvedValue(mockUser);
      const result = await controller.findById('1');
      expect(result).toEqual(mockUser);
    });

    it('should pass errors from service', async () => {
      const error = new UsuarioNotFoundError('1');
      mockUsuariosService.findById.mockRejectedValue(error);
      await expect(controller.findById('1')).rejects.toThrow(
        UsuarioNotFoundError,
      );
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      mockUsuariosService.update.mockResolvedValue(mockUser);
      const result = await controller.update('1', { nombre: 'New' });
      expect(result).toEqual(mockUser);
      expect(mockUsuariosService.update).toHaveBeenCalledWith('1', {
        nombre: 'New',
      });
    });

    it('should pass errors from service during update', async () => {
      const error = new UsuarioNotFoundError('99');
      mockUsuariosService.update.mockRejectedValue(error);
      await expect(controller.update('99', { nombre: 'New' })).rejects.toThrow(
        UsuarioNotFoundError,
      );
    });
  });
});
