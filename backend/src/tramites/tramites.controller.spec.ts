/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TramitesController } from './tramites.controller';
import { TramitesService } from './tramites.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CrearTramiteDto } from './dto/crear-tramite.dto';

import { RolUsuario, Tramite } from '@prisma/client';
import { AuthUser } from '../auth/auth.types';
import { TipoTramiteNoConfiguradoError } from '../common/errors/app.error';

describe('TramitesController', () => {
  let controller: TramitesController;
  let service: TramitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TramitesController],
      providers: [
        {
          provide: TramitesService,
          useValue: {
            createTramite: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<TramitesController>(TramitesController);
    service = module.get<TramitesService>(TramitesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a tramite', async () => {
      const dto: CrearTramiteDto = {
        inmuebleId: 'inm-1',
        tipoTramiteId: 'tipo-1',
      };
      const mockUser: AuthUser = {
        id: 'usr-1',
        email: 'test@test.com',
        rol: RolUsuario.ADMIN,
        nombre: 'Test',
        apellido: 'User',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockResult: Tramite = {
        id: '1',
        inmuebleId: 'inm-1',
        tipoTramiteId: 'tipo-1',
        estadoActual: 'INICIADO',
        motivoBloqueo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'createTramite').mockResolvedValue(mockResult);

      const result = await controller.create(dto, mockUser);

      expect(service.createTramite).toHaveBeenCalledWith(dto, 'usr-1');
      expect(result).toEqual(mockResult);
    });

    it('should propagate a domain error when the service rejects', async () => {
      const dto: CrearTramiteDto = {
        inmuebleId: 'inm-1',
        tipoTramiteId: 'tipo-1',
      };
      const mockUser: AuthUser = {
        id: 'usr-1',
        email: 'test@test.com',
        rol: RolUsuario.ADMIN,
        nombre: 'Test',
        apellido: 'User',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const error = new TipoTramiteNoConfiguradoError('tipo-1');

      jest.spyOn(service, 'createTramite').mockRejectedValue(error);

      await expect(controller.create(dto, mockUser)).rejects.toBe(error);
    });
  });
});
