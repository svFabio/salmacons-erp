import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { UsuariosRepository } from './usuarios.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { RolUsuario } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let repository: jest.Mocked<UsuariosRepository>;

  const mockUsuario = {
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
    const mockRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };

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
    repository = module.get(UsuariosRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if email exists', async () => {
      repository.findByEmail.mockResolvedValue(mockUsuario as any);
      await expect(service.create({ email: 'test@test.com', password: 'password', nombre: 'Test', apellido: 'User' })).rejects.toThrow(ConflictException);
    });

    it('should create a user', async () => {
      repository.findByEmail.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockUsuario as any);
      const result = await service.create({ email: 'new@test.com', password: 'password', nombre: 'Test', apellido: 'User' });
      expect(result).not.toHaveProperty('passwordHash');
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      repository.findAll.mockResolvedValue([mockUsuario] as any);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0]).not.toHaveProperty('passwordHash');
    });
  });

  describe('findById', () => {
    it('should return a user', async () => {
      repository.findById.mockResolvedValue(mockUsuario as any);
      const result = await service.findById('1');
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.findById('2')).rejects.toThrow(NotFoundException);
    });
  });
});
