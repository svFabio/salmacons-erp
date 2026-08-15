import { Test, TestingModule } from '@nestjs/testing';
import { ClientesService } from './clientes.service';
import { ClientesRepository } from '../repositories/clientes.repository';
import { NotFoundException, ConflictException } from '@nestjs/common';

const mockClientesRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByCi: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ClientesService', () => {
  let service: ClientesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        { provide: ClientesRepository, useValue: mockClientesRepository },
      ],
    }).compile();

    service = module.get<ClientesService>(ClientesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all clientes', async () => {
    mockClientesRepository.findAll.mockResolvedValue([]);
    expect(await service.findAll()).toEqual([]);
  });

  it('findById should throw NotFoundException if not found', async () => {
    mockClientesRepository.findById.mockResolvedValue(null);
    await expect(service.findById('1')).rejects.toThrow(NotFoundException);
  });

  it('create should throw ConflictException if ci exists', async () => {
    mockClientesRepository.findByCi.mockResolvedValue({ id: '2', ci: '123' });
    await expect(
      service.create({ nombres: 'a', apellidos: 'b', ci: '123' }),
    ).rejects.toThrow(ConflictException);
  });

  it('update should throw ConflictException if new ci belongs to another cliente', async () => {
    mockClientesRepository.findById.mockResolvedValue({ id: '1', ci: '111' });
    mockClientesRepository.findByCi.mockResolvedValue({ id: '2', ci: '222' });
    await expect(service.update('1', { ci: '222' })).rejects.toThrow(
      ConflictException,
    );
  });
});
