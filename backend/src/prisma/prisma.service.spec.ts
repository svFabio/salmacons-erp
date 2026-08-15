import {
  GLOBAL_MODULE_METADATA,
  INJECTABLE_WATERMARK,
} from '@nestjs/common/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

jest.mock('@prisma/client', () => {
  class MockPrismaClient {
    public readonly $connect = jest.fn();
    public readonly $disconnect = jest.fn();
  }

  return { PrismaClient: MockPrismaClient };
});

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(() => {
    service = new PrismaService();
  });

  it('extends PrismaClient', () => {
    expect(Object.getPrototypeOf(PrismaService)).toBe(PrismaClient);
    expect(service).toBeInstanceOf(PrismaClient);
  });

  it('implements OnModuleInit and OnModuleDestroy', () => {
    expect(typeof service.onModuleInit).toBe('function');
    expect(typeof service.onModuleDestroy).toBe('function');
  });

  it('calls $connect on module init', async () => {
    const connectSpy = jest.spyOn(service, '$connect');

    await service.onModuleInit();

    expect(connectSpy).toHaveBeenCalledTimes(1);
  });

  it('calls $disconnect on module destroy', async () => {
    const disconnectSpy = jest.spyOn(service, '$disconnect');

    await service.onModuleDestroy();

    expect(disconnectSpy).toHaveBeenCalledTimes(1);
  });

  it('is marked as injectable', () => {
    expect(Reflect.getMetadata(INJECTABLE_WATERMARK, PrismaService)).toBe(true);
  });

  it('is resolvable through the Nest DI container', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    expect(moduleRef.get(PrismaService)).toBeInstanceOf(PrismaService);
  });
});

describe('PrismaModule', () => {
  it('is marked as global', () => {
    expect(Reflect.getMetadata(GLOBAL_MODULE_METADATA, PrismaModule)).toBe(
      true,
    );
  });

  it('exports PrismaService', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();

    expect(moduleRef.get(PrismaService)).toBeInstanceOf(PrismaService);
  });
});
