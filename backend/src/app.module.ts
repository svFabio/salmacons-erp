import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClientesModule } from './clientes/clientes.module';
import { InmueblesModule } from './inmuebles/inmuebles.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { TramitesModule } from './tramites/tramites.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ClientesModule,
    InmueblesModule,
    UsuariosModule,
    AuthModule,
    TramitesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
