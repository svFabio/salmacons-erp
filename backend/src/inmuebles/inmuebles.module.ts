import { Module } from '@nestjs/common';
import { InmueblesService } from './inmuebles.service';
import { InmueblesController } from './inmuebles.controller';
import { InmueblesRepository } from '../repositories/inmuebles.repository';

@Module({
  controllers: [InmueblesController],
  providers: [InmueblesService, InmueblesRepository],
  exports: [InmueblesService],
})
export class InmueblesModule {}
