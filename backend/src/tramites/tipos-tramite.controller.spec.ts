/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { TiposTramiteController } from './tipos-tramite.controller';
import { TiposTramiteService } from './tipos-tramite.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AreaTramite, TipoTramite, RolUsuario } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('TiposTramiteController', () => {
  let controller: TiposTramiteController;
  let service: TiposTramiteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiposTramiteController],
      providers: [
        {
          provide: TiposTramiteService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TiposTramiteController>(TiposTramiteController);
    service = module.get<TiposTramiteService>(TiposTramiteService);
  });

  it('deberia estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('deberia listar tipos de tramite', async () => {
    const mockData = [
      { id: '1', nombre: 'Plano', area: AreaTramite.TECNICA, descripcion: '' },
    ];
    jest
      .spyOn(service, 'findAll')
      .mockResolvedValue(mockData as unknown as TipoTramite[]);

    const result = await controller.findAll();
    expect(result).toEqual(mockData);
  });

  it('deberia buscar por id', async () => {
    const mockData = {
      id: '1',
      nombre: 'Plano',
      area: AreaTramite.TECNICA,
      descripcion: '',
    };
    jest
      .spyOn(service, 'findById')
      .mockResolvedValue(mockData as unknown as TipoTramite);

    const result = await controller.findById('1');
    expect(result).toEqual(mockData);
  });

  it('deberia crear tipo de tramite', async () => {
    const dto = { nombre: 'Plano', area: AreaTramite.TECNICA };
    const mockData = { id: '1', ...dto, descripcion: '' };
    jest
      .spyOn(service, 'create')
      .mockResolvedValue(mockData as unknown as TipoTramite);

    const result = await controller.create(dto);
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
      .spyOn(service, 'update')
      .mockResolvedValue(mockData as unknown as TipoTramite);

    const result = await controller.update('1', dto);
    expect(result).toEqual(mockData);
  });

  it('deberia eliminar tipo de tramite', async () => {
    jest.spyOn(service, 'delete').mockResolvedValue(undefined);

    await controller.delete('1');
    expect(service.delete).toHaveBeenCalledWith('1');
  });

  it('deberia propagar NotFoundException al buscar id inexistente', async () => {
    jest.spyOn(service, 'findById').mockRejectedValue(new NotFoundException());
    await expect(controller.findById('999')).rejects.toThrow(NotFoundException);
  });

  it('deberia tener roles definidos en los endpoints', () => {
    const findAllRoles = Reflect.getMetadata('roles', controller.findAll);
    expect(findAllRoles).toEqual([
      RolUsuario.ADMIN,
      RolUsuario.ABOGADO,
      RolUsuario.ARQUITECTO,
    ]);

    const findByIdRoles = Reflect.getMetadata('roles', controller.findById);
    expect(findByIdRoles).toEqual([
      RolUsuario.ADMIN,
      RolUsuario.ABOGADO,
      RolUsuario.ARQUITECTO,
    ]);

    const createRoles = Reflect.getMetadata('roles', controller.create);
    expect(createRoles).toEqual([RolUsuario.ADMIN]);

    const updateRoles = Reflect.getMetadata('roles', controller.update);
    expect(updateRoles).toEqual([RolUsuario.ADMIN]);

    const deleteRoles = Reflect.getMetadata('roles', controller.delete);
    expect(deleteRoles).toEqual([RolUsuario.ADMIN]);
  });
});
