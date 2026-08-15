import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosRepository } from './usuarios.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

describe('UsuariosRepository', () => {
  let repository: UsuariosRepository;

  const createMock = jest.fn();
  const findManyMock = jest.fn();
  const findUniqueMock = jest.fn();
  const updateMock = jest.fn();

  const mockPrisma = {
    usuario: {
      create: createMock,
      findMany: findManyMock,
      findUnique: findUniqueMock,
      update: updateMock,
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<UsuariosRepository>(UsuariosRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should delegate create to prisma.usuario.create', async () => {
    const data: Prisma.UsuarioCreateInput = {
      email: 'new@test.com',
      passwordHash: 'hash',
      nombre: 'Test',
      apellido: 'User',
    };

    await repository.create(data);

    expect(createMock).toHaveBeenCalledWith({ data });
  });
});
