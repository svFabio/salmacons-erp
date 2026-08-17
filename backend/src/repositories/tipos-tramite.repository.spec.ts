/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TiposTramiteRepository } from './tipos-tramite.repository';
import { PrismaService } from '../prisma/prisma.service';
import { AreaTramite, TipoTramite } from '@prisma/client';

describe('TiposTramiteRepository', () => {
  let repository: TiposTramiteRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TiposTramiteRepository,
        {
          provide: PrismaService,
          useValue: {
            tipoTramite: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<TiposTramiteRepository>(TiposTramiteRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deberia estar definido', () => {
    expect(repository).toBeDefined();
  });

  it('deberia listar todos los tipos de tramite', async () => {
    const mockData = [
      { id: '1', nombre: 'Plano', area: AreaTramite.TECNICA, descripcion: '' },
    ];
    jest
      .spyOn(prisma.tipoTramite, 'findMany')
      .mockResolvedValue(mockData as unknown as TipoTramite[]);

    const result = await repository.findAll();
    expect(result).toEqual(mockData);
    expect(prisma.tipoTramite.findMany).toHaveBeenCalledWith({
      include: { pasos: { orderBy: { orden: 'asc' } } },
    });
  });

  it('deberia buscar por id', async () => {
    const mockData = {
      id: '1',
      nombre: 'Plano',
      area: AreaTramite.TECNICA,
      descripcion: '',
    };
    jest
      .spyOn(prisma.tipoTramite, 'findUnique')
      .mockResolvedValue(mockData as unknown as TipoTramite);

    const result = await repository.findById('1');
    expect(result).toEqual(mockData);
    expect(prisma.tipoTramite.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: { pasos: { orderBy: { orden: 'asc' } } },
    });
  });

  it('deberia crear tipo de tramite', async () => {
    const data = { nombre: 'Plano', area: AreaTramite.TECNICA };
    const mockData = { id: '1', ...data, descripcion: '' };
    jest
      .spyOn(prisma.tipoTramite, 'create')
      .mockResolvedValue(mockData as unknown as TipoTramite);

    const result = await repository.create(data);
    expect(result).toEqual(mockData);
  });

  it('deberia actualizar tipo de tramite', async () => {
    const data = { nombre: 'Plano Modificado' };
    const mockData = {
      id: '1',
      nombre: 'Plano Modificado',
      area: AreaTramite.TECNICA,
      descripcion: '',
    };
    jest
      .spyOn(prisma.tipoTramite, 'update')
      .mockResolvedValue(mockData as unknown as TipoTramite);

    const result = await repository.update('1', data);
    expect(result).toEqual(mockData);
  });

  it('deberia eliminar tipo de tramite', async () => {
    jest
      .spyOn(prisma.tipoTramite, 'delete')
      .mockResolvedValue({} as unknown as TipoTramite);

    await repository.delete('1');
    expect(prisma.tipoTramite.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });
});
