import { Test, TestingModule } from '@nestjs/testing';
import { ClientesRepository } from './clientes.repository';
import { PrismaService } from '../prisma/prisma.service';
import { ClienteConInmuebles } from '../common/types/prisma-relations.types';

const mockInmueble = {
  id: 'inm-1',
  direccion: 'Av. Arce 123',
  matricula: null,
  codigoCatastral: null,
  superficie: null,
  descripcion: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockClienteConInmuebles: ClienteConInmuebles = {
  id: 'cli-1',
  nombres: 'Test',
  apellidos: 'Apellido',
  ci: '12345',
  email: null,
  telefono: null,
  direccion: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  inmuebles: [
    {
      clienteId: 'cli-1',
      inmuebleId: 'inm-1',
      rol: 'PROPIETARIO',
      createdAt: new Date(),
      inmueble: mockInmueble,
    },
  ],
};

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('findAll should return array of clientes with inmuebles', async () => {
    mockPrismaService.cliente.findMany.mockResolvedValue([
      mockClienteConInmuebles,
    ]);
    const result = await repository.findAll();
    expect(result).toEqual([mockClienteConInmuebles]);
    expect(mockPrismaService.cliente.findMany).toHaveBeenCalledWith({
      include: { inmuebles: { include: { inmueble: true } } },
    });
  });

  it('findById should return a cliente with inmuebles', async () => {
    mockPrismaService.cliente.findUnique.mockResolvedValue(
      mockClienteConInmuebles,
    );
    const result = await repository.findById('cli-1');
    expect(result).toEqual(mockClienteConInmuebles);
    expect(mockPrismaService.cliente.findUnique).toHaveBeenCalledWith({
      where: { id: 'cli-1' },
      include: { inmuebles: { include: { inmueble: true } } },
    });
  });

  it('findById should return null when not found', async () => {
    mockPrismaService.cliente.findUnique.mockResolvedValue(null);
    const result = await repository.findById('inexistente');
    expect(result).toBeNull();
  });

  it('findByCi should return a cliente', async () => {
    const mockCliente = { id: 'cli-1', ci: '12345' };
    mockPrismaService.cliente.findUnique.mockResolvedValue(mockCliente);
    const result = await repository.findByCi('12345');
    expect(result).toEqual(mockCliente);
    expect(mockPrismaService.cliente.findUnique).toHaveBeenCalledWith({
      where: { ci: '12345' },
    });
  });

  it('create should create a cliente and return it with inmuebles', async () => {
    mockPrismaService.cliente.create.mockResolvedValue(mockClienteConInmuebles);
    const result = await repository.create({
      nombres: 'Test',
      apellidos: 'Apellido',
      ci: '12345',
    });
    expect(result).toEqual(mockClienteConInmuebles);
    expect(mockPrismaService.cliente.create).toHaveBeenCalledWith({
      data: { nombres: 'Test', apellidos: 'Apellido', ci: '12345' },
      include: { inmuebles: { include: { inmueble: true } } },
    });
  });

  it('update should update a cliente and return it with inmuebles', async () => {
    mockPrismaService.cliente.update.mockResolvedValue(mockClienteConInmuebles);
    const result = await repository.update('cli-1', { nombres: 'Nuevo' });
    expect(result).toEqual(mockClienteConInmuebles);
    expect(mockPrismaService.cliente.update).toHaveBeenCalledWith({
      where: { id: 'cli-1' },
      data: { nombres: 'Nuevo' },
      include: { inmuebles: { include: { inmueble: true } } },
    });
  });

  it('delete should delete a cliente', async () => {
    mockPrismaService.cliente.delete.mockResolvedValue({ id: 'cli-1' });
    await expect(repository.delete('cli-1')).resolves.toBeUndefined();
    expect(mockPrismaService.cliente.delete).toHaveBeenCalledWith({
      where: { id: 'cli-1' },
    });
  });
});
