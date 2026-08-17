/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TiposTramiteService } from './tipos-tramite.service';
import { TiposTramiteRepository } from '../repositories/tipos-tramite.repository';
import { AreaTramite, TipoTramite } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('TiposTramiteService', () => {
  let service: TiposTramiteService;
  let repository: TiposTramiteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TiposTramiteService,
        {
          provide: TiposTramiteRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TiposTramiteService>(TiposTramiteService);
    repository = module.get<TiposTramiteRepository>(TiposTramiteRepository);
  });

  it('deberia listar tipos de tramite', async () => {
    const mockList = [{ id: '1', nombre: 'Test', area: AreaTramite.LEGAL }];
    jest
      .spyOn(repository, 'findAll')
      .mockResolvedValue(mockList as unknown as TipoTramite[]);

    const result = await service.findAll();
    expect(result).toEqual(mockList);
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('deberia buscar por id', async () => {
    const mockItem = { id: '1', nombre: 'Test', area: AreaTramite.LEGAL };
    jest
      .spyOn(repository, 'findById')
      .mockResolvedValue(mockItem as unknown as TipoTramite);

    const result = await service.findById('1');
    expect(result).toEqual(mockItem);
  });

  it('deberia lanzar NotFoundException si no existe el tipo', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(null);

    await expect(service.findById('999')).rejects.toThrow(NotFoundException);
  });

  it('deberia crear tipo de tramite', async () => {
    const dto = { nombre: 'Plano', area: AreaTramite.TECNICA };
    const mockData = { id: '1', ...dto, descripcion: '' };
    jest
      .spyOn(repository, 'create')
      .mockResolvedValue(mockData as unknown as TipoTramite);

    const result = await service.create(dto);
    expect(result).toEqual(mockData);
  });

  it('deberia actualizar tipo de tramite', async () => {
    const dto = { nombre: 'Plano Modificado' };
    const mockData = {
      id: '1',
      nombre: 'Plano Modificado',
      area: AreaTramite.TECNICA,
      descripcion: '',
    };
    jest
      .spyOn(repository, 'findById')
      .mockResolvedValue(mockData as unknown as TipoTramite);
    jest
      .spyOn(repository, 'update')
      .mockResolvedValue(mockData as unknown as TipoTramite);

    const result = await service.update('1', dto);
    expect(result).toEqual(mockData);
  });

  it('deberia lanzar NotFoundException al actualizar tipo de tramite inexistente', async () => {
    const dto = { nombre: 'Plano Modificado' };
    jest.spyOn(repository, 'findById').mockResolvedValue(null);
    await expect(service.update('999', dto)).rejects.toThrow(NotFoundException);
  });

  it('deberia eliminar tipo de tramite', async () => {
    const mockData = {
      id: '1',
      nombre: 'Plano',
      area: AreaTramite.TECNICA,
      descripcion: '',
    };
    jest
      .spyOn(repository, 'findById')
      .mockResolvedValue(mockData as unknown as TipoTramite);
    jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

    await service.delete('1');
    expect(repository.delete).toHaveBeenCalledWith('1');
  });

  it('deberia lanzar NotFoundException al eliminar tipo de tramite inexistente', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue(null);
    await expect(service.delete('999')).rejects.toThrow(NotFoundException);
  });
});
