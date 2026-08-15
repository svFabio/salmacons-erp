import { Test, TestingModule } from '@nestjs/testing';
import { InmueblesController } from './inmuebles.controller';
import { InmueblesService } from './inmuebles.service';

const mockInmueblesService = {};

describe('InmueblesController', () => {
  let controller: InmueblesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InmueblesController],
      providers: [{ provide: InmueblesService, useValue: mockInmueblesService }],
    }).compile();

    controller = module.get<InmueblesController>(InmueblesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
