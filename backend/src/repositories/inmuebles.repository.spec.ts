import { Test, TestingModule } from '@nestjs/testing';
import { InmueblesRepository } from './inmuebles.repository';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  inmueble: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  clienteInmueble: {
    create: jest.fn(),
  }
};

describe('InmueblesRepository', () => {
  let repository: InmueblesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InmueblesRepository,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    repository = module.get<InmueblesRepository>(InmueblesRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
