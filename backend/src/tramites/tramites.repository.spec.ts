/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TramitesRepository } from './tramites.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Tramite, HistorialTramite } from '@prisma/client';

describe('TramitesRepository', () => {
  let repository: TramitesRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TramitesRepository,
        {
          provide: PrismaService,
          useValue: {
            tramite: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
            },
            historialTramite: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<TramitesRepository>(TramitesRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new tramite', async () => {
      const mockTramite: Tramite = {
        id: '1',
        inmuebleId: 'inm-1',
        tipoTramiteId: 'tipo-1',
        estadoActual: 'INICIADO',
        motivoBloqueo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.tramite, 'create')
        .mockResolvedValue(mockTramite);

      const result = await repository.create({
        inmuebleId: 'inm-1',
        tipoTramiteId: 'tipo-1',
        estadoActual: 'INICIADO',
      });

      expect(prismaService.tramite.create).toHaveBeenCalledWith({
        data: {
          inmuebleId: 'inm-1',
          tipoTramiteId: 'tipo-1',
          estadoActual: 'INICIADO',
        },
      });
      expect(result).toEqual(mockTramite);
    });
  });

  describe('addHistorial', () => {
    it('should add history to a tramite', async () => {
      const mockHistorial: HistorialTramite = {
        id: 'hist-1',
        tramiteId: '1',
        usuarioId: 'usr-1',
        estadoAnterior: 'INICIADO',
        estadoNuevo: 'REVISIÓN',
        observacion: 'Todo en orden',
        fecha: new Date(),
      };

      jest
        .spyOn(prismaService.historialTramite, 'create')
        .mockResolvedValue(mockHistorial);

      const result = await repository.addHistorial({
        tramiteId: '1',
        usuarioId: 'usr-1',
        estadoAnterior: 'INICIADO',
        estadoNuevo: 'REVISIÓN',
        observacion: 'Todo en orden',
      });

      expect(prismaService.historialTramite.create).toHaveBeenCalledWith({
        data: {
          tramiteId: '1',
          usuarioId: 'usr-1',
          estadoAnterior: 'INICIADO',
          estadoNuevo: 'REVISIÓN',
          observacion: 'Todo en orden',
        },
      });
      expect(result).toEqual(mockHistorial);
    });
  });
});
