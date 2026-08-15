import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './clientes/clientes.module';
import { InmueblesModule } from './inmuebles/inmuebles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsuariosModule,
    AuthModule,
    PrismaModule,
    ClientesModule,
    InmueblesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
