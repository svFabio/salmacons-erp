import { Test, TestingModule } from '@nestjs/testing';
import { InmueblesRepository } from './inmuebles.repository';
import { PrismaService } from '../prisma/prisma.service';
import { InmuebleConClientes } from '../common/types/prisma-relations.types';
import { RolClienteInmueble } from '@prisma/client';

const mockCliente = {
  id: 'cli-1',
  nombres: 'Juan',
  apellidos: 'Pérez',
  ci: '12345',
  email: null,
  telefono: null,
  direccion: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockInmuebleConClientes: InmuebleConClientes = {
  id: 'inm-1',
  matricula: 'M-001',
  codigoCatastral: null,
  direccion: 'Av. Arce 123',
  superficie: null,
  descripcion: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  clientes: [
    {
      clienteId: 'cli-1',
      inmuebleId: 'inm-1',
      rol: 'PROPIETARIO',
      createdAt: new Date(),
      cliente: mockCliente,
    },
  ],
};

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
  },
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('findAll should return array of inmuebles with clientes', async () => {
    mockPrismaService.inmueble.findMany.mockResolvedValue([
      mockInmuebleConClientes,
    ]);
    const result = await repository.findAll();
    expect(result).toEqual([mockInmuebleConClientes]);
    expect(mockPrismaService.inmueble.findMany).toHaveBeenCalledWith({
      include: { clientes: { include: { cliente: true } } },
    });
  });

  it('findById should return an inmueble with clientes', async () => {
    mockPrismaService.inmueble.findUnique.mockResolvedValue(
      mockInmuebleConClientes,
    );
    const result = await repository.findById('inm-1');
    expect(result).toEqual(mockInmuebleConClientes);
    expect(mockPrismaService.inmueble.findUnique).toHaveBeenCalledWith({
      where: { id: 'inm-1' },
      include: { clientes: { include: { cliente: true } } },
    });
  });

  it('findById should return null when not found', async () => {
    mockPrismaService.inmueble.findUnique.mockResolvedValue(null);
    const result = await repository.findById('inexistente');
    expect(result).toBeNull();
  });

  it('create should create an inmueble and return it with clientes', async () => {
    mockPrismaService.inmueble.create.mockResolvedValue(
      mockInmuebleConClientes,
    );
    const result = await repository.create({ direccion: 'Av. Arce 123' });
    expect(result).toEqual(mockInmuebleConClientes);
    expect(mockPrismaService.inmueble.create).toHaveBeenCalledWith({
      data: { direccion: 'Av. Arce 123' },
      include: { clientes: { include: { cliente: true } } },
    });
  });

  it('update should update an inmueble and return it with clientes', async () => {
    mockPrismaService.inmueble.update.mockResolvedValue(
      mockInmuebleConClientes,
    );
    const result = await repository.update('inm-1', { matricula: 'M-002' });
    expect(result).toEqual(mockInmuebleConClientes);
    expect(mockPrismaService.inmueble.update).toHaveBeenCalledWith({
      where: { id: 'inm-1' },
      data: { matricula: 'M-002' },
      include: { clientes: { include: { cliente: true } } },
    });
  });

  it('delete should delete an inmueble', async () => {
    mockPrismaService.inmueble.delete.mockResolvedValue({ id: 'inm-1' });
    await expect(repository.delete('inm-1')).resolves.toBeUndefined();
    expect(mockPrismaService.inmueble.delete).toHaveBeenCalledWith({
      where: { id: 'inm-1' },
    });
  });

  it('asociarCliente should create a clienteInmueble relation', async () => {
    const mockRelacion = {
      clienteId: 'cli-1',
      inmuebleId: 'inm-1',
      rol: RolClienteInmueble.PROPIETARIO,
      createdAt: new Date(),
    };
    mockPrismaService.clienteInmueble.create.mockResolvedValue(mockRelacion);
    const result = await repository.asociarCliente(
      'inm-1',
      'cli-1',
      RolClienteInmueble.PROPIETARIO,
    );
    expect(result).toEqual(mockRelacion);
    expect(mockPrismaService.clienteInmueble.create).toHaveBeenCalledWith({
      data: {
        inmuebleId: 'inm-1',
        clienteId: 'cli-1',
        rol: RolClienteInmueble.PROPIETARIO,
      },
    });
  });
});
