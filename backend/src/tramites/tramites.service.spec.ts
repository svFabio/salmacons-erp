/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TramitesService } from './tramites.service';
import { TramitesRepository } from './tramites.repository';
import { Tramite, HistorialTramite } from '@prisma/client';
import {
  InmuebleNotFoundError,
  TipoTramiteNoConfiguradoError,
} from '../common/errors/app.error';

describe('TramitesService', () => {
  let service: TramitesService;
  let repository: TramitesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TramitesService,
        {
          provide: TramitesRepository,
          useValue: {
            create: jest.fn(),
            addHistorial: jest.fn(),
            checkInmuebleExists: jest.fn(),
            getFirstStateForTipoTramite: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TramitesService>(TramitesService);
    repository = module.get<TramitesRepository>(TramitesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTramite', () => {
    it('should create a tramite and add initial history', async () => {
      const mockTramite: Tramite = {
        id: '1',
        inmuebleId: 'inm-1',
        tipoTramiteId: 'tipo-1',
        estadoActual: 'INICIAL_CONFIGURADO',
        motivoBloqueo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockHistorial: HistorialTramite = {
        id: '1',
        tramiteId: '1',
        usuarioId: 'usr-1',
        estadoAnterior: null,
        estadoNuevo: 'INICIAL_CONFIGURADO',
        observacion: 'Trámite inicializado',
        fecha: new Date(),
      };

      const mockUser = 'usr-1';

      jest.spyOn(repository, 'checkInmuebleExists').mockResolvedValue(true);
      jest.spyOn(repository, 'getFirstStateForTipoTramite').mockResolvedValue({
        id: 'paso-1',
        tipoTramiteId: 'tipo-1',
        nombreEstado: 'INICIAL_CONFIGURADO',
        orden: 1,
        requiereDocumento: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      jest.spyOn(repository, 'create').mockResolvedValue(mockTramite);
      jest.spyOn(repository, 'addHistorial').mockResolvedValue(mockHistorial);

      const result = await service.createTramite(
        {
          inmuebleId: 'inm-1',
          tipoTramiteId: 'tipo-1',
        },
        mockUser,
      );

      expect(repository.checkInmuebleExists).toHaveBeenCalledWith('inm-1');
      expect(repository.getFirstStateForTipoTramite).toHaveBeenCalledWith(
        'tipo-1',
      );
      expect(repository.create).toHaveBeenCalledWith({
        inmuebleId: 'inm-1',
        tipoTramiteId: 'tipo-1',
        estadoActual: 'INICIAL_CONFIGURADO',
      });
      expect(repository.addHistorial).toHaveBeenCalledWith({
        tramiteId: '1',
        usuarioId: mockUser,
        estadoAnterior: null,
        estadoNuevo: 'INICIAL_CONFIGURADO',
        observacion: 'Trámite inicializado',
      });
      expect(result).toEqual(mockTramite);
    });

    it('should throw InmuebleNotFoundError if inmueble does not exist', async () => {
      jest.spyOn(repository, 'checkInmuebleExists').mockResolvedValue(false);

      await expect(
        service.createTramite(
          { inmuebleId: 'invalid-id', tipoTramiteId: 'tipo-1' },
          'usr-1',
        ),
      ).rejects.toThrow(InmuebleNotFoundError);
    });

    it('should throw TipoTramiteNoConfiguradoError if no steps are configured', async () => {
      jest.spyOn(repository, 'checkInmuebleExists').mockResolvedValue(true);
      jest
        .spyOn(repository, 'getFirstStateForTipoTramite')
        .mockResolvedValue(null);

      await expect(
        service.createTramite(
          { inmuebleId: 'inm-1', tipoTramiteId: 'invalid-tipo' },
          'usr-1',
        ),
      ).rejects.toThrow(TipoTramiteNoConfiguradoError);
    });
  });
});
