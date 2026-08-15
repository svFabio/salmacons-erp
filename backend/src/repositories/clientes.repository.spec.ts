import { Test, TestingModule } from '@nestjs/testing';
import { ClientesRepository } from './clientes.repository';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  cliente: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ClientesRepository', () => {
  let repository: ClientesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesRepository,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    repository = module.get<ClientesRepository>(ClientesRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('findAll should return array of clientes', async () => {
    const expected = [{ id: '1', nombres: 'Test' }];
    mockPrismaService.cliente.findMany.mockResolvedValue(expected);
    const result = await repository.findAll();
    expect(result).toEqual(expected);
  });

  it('findById should return a cliente', async () => {
    const expected = { id: '1', nombres: 'Test' };
    mockPrismaService.cliente.findUnique.mockResolvedValue(expected);
    const result = await repository.findById('1');
    expect(result).toEqual(expected);
  });

  it('findByCi should return a cliente', async () => {
    const expected = { id: '1', ci: '123' };
    mockPrismaService.cliente.findUnique.mockResolvedValue(expected);
    const result = await repository.findByCi('123');
    expect(result).toEqual(expected);
  });

  it('create should create a cliente', async () => {
    const expected = { id: '1', nombres: 'Test' };
    mockPrismaService.cliente.create.mockResolvedValue(expected);
    const result = await repository.create({
      nombres: 'Test',
      apellidos: 'A',
      ci: '123',
    });
    expect(result).toEqual(expected);
  });

  it('update should update a cliente', async () => {
    const expected = { id: '1', nombres: 'Test2' };
    mockPrismaService.cliente.update.mockResolvedValue(expected);
    const result = await repository.update('1', { nombres: 'Test2' });
    expect(result).toEqual(expected);
  });

  it('delete should delete a cliente', async () => {
    mockPrismaService.cliente.delete.mockResolvedValue({ id: '1' });
    await expect(repository.delete('1')).resolves.toBeUndefined();
    expect(mockPrismaService.cliente.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });
});
