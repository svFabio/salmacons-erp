import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './clientes/clientes.module';
import { InmueblesModule } from './inmuebles/inmuebles.module';

@Module({
  imports: [
    UsuariosModule,
    AuthModule,PrismaModule, ClientesModule, InmueblesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
