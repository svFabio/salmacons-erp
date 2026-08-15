import { Test, TestingModule } from '@nestjs/testing';
import { InmueblesService } from './inmuebles.service';
import { InmueblesRepository } from '../repositories/inmuebles.repository';

const mockInmueblesRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  asociarCliente: jest.fn(),
};

describe('InmueblesService', () => {
  let service: InmueblesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InmueblesService,
        { provide: InmueblesRepository, useValue: mockInmueblesRepository },
      ],
    }).compile();

    service = module.get<InmueblesService>(InmueblesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
