import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosRepository } from './usuarios.repository';
import { PrismaService } from '../repositories/prisma.service';

describe('UsuariosRepository', () => {
  let repository: UsuariosRepository;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrisma = {
      usuario: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      }
    };

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
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
