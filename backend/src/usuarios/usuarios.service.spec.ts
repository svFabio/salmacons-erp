import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { UsuariosRepository } from './usuarios.repository';
import { RolUsuario, Usuario } from '@prisma/client';
import {
  UsuarioAlreadyExistsError,
  UsuarioNotFoundError,
} from '../common/errors/app.error';

describe('UsuariosService', () => {
  let service: UsuariosService;

  const findByEmailMock = jest.fn();
  const createMock = jest.fn();
  const findAllMock = jest.fn();
  const findByIdMock = jest.fn();
  const updateMock = jest.fn();

  const mockRepository = {
    findByEmail: findByEmailMock,
    create: createMock,
    findAll: findAllMock,
    findById: findByIdMock,
    update: updateMock,
  };

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

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: UsuariosRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw UsuarioAlreadyExistsError if email exists', async () => {
      findByEmailMock.mockResolvedValue(mockUsuario);

      await expect(
        service.create({
          email: 'test@test.com',
          password: 'password',
          nombre: 'Test',
          apellido: 'User',
        }),
      ).rejects.toThrow(UsuarioAlreadyExistsError);
    });

    it('should create a user without exposing the password hash', async () => {
      findByEmailMock.mockResolvedValue(null);
      createMock.mockResolvedValue(mockUsuario);

      const result = await service.create({
        email: 'new@test.com',
        password: 'password',
        nombre: 'Test',
        apellido: 'User',
      });

      expect(result).not.toHaveProperty('passwordHash');
      expect(createMock).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users without exposing password hashes', async () => {
      findAllMock.mockResolvedValue([mockUsuario]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).not.toHaveProperty('passwordHash');
    });
  });

  describe('findById', () => {
    it('should return a user without exposing the password hash', async () => {
      findByIdMock.mockResolvedValue(mockUsuario);

      const result = await service.findById('1');

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('should throw UsuarioNotFoundError if user not found', async () => {
      findByIdMock.mockResolvedValue(null);

      await expect(service.findById('2')).rejects.toThrow(UsuarioNotFoundError);
    });
  });

  describe('update', () => {
    it('should update the user and return it without the password hash', async () => {
      findByIdMock.mockResolvedValue(mockUsuario);
      updateMock.mockResolvedValue({
        ...mockUsuario,
        nombre: 'Nuevo',
      });

      const result = await service.update('1', { nombre: 'Nuevo' });

      expect(result).toHaveProperty('nombre', 'Nuevo');
      expect(result).not.toHaveProperty('passwordHash');
      expect(updateMock).toHaveBeenCalled();
    });

    it('should throw UsuarioNotFoundError if user does not exist during update', async () => {
      findByIdMock.mockResolvedValue(null);
      await expect(service.update('99', { nombre: 'Nuevo' })).rejects.toThrow(
        UsuarioNotFoundError,
      );
    });
  });
});
