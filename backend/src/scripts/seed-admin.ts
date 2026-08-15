import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsuariosRepository } from '../usuarios/usuarios.repository';
import * as bcrypt from 'bcryptjs';
import { Logger } from '@nestjs/common';
import { RolUsuario } from '@prisma/client';
import { INestApplicationContext } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const logger = new Logger('SeedAdmin');

  const adminEmail = process.env.ADMIN_SEED_EMAIL;
  const adminPassword = process.env.ADMIN_SEED_PASSWORD;

  if (!adminEmail || !adminPassword) {
    logger.error(
      'ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD environment variables are required.',
    );
    process.exit(1);
  }

  let app: INestApplicationContext | null = null;
  let hasError = false;

  try {
    app = await NestFactory.createApplicationContext(AppModule);
    const usuariosRepository = app.get(UsuariosRepository);

    const existing = await usuariosRepository.findByEmail(adminEmail);
    if (existing) {
      logger.log(`Admin user ${adminEmail} already exists.`);
      return;
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await usuariosRepository.create({
      email: adminEmail,
      passwordHash,
      nombre: 'Super',
      apellido: 'Admin',
      rol: RolUsuario.ADMIN,
      activo: true,
    });

    logger.log(`Created admin user: ${adminEmail}`);
  } catch (error: unknown) {
    logger.error('Failed to seed admin', error);
    hasError = true;
  } finally {
    if (app) {
      await app.close();
    }
    if (hasError) {
      process.exit(1);
    }
  }
}

void bootstrap().catch((err: unknown) => {
  const fallbackLogger = new Logger('SeedAdminError');
  fallbackLogger.error('Fatal error during seed execution', err);
  process.exit(1);
});
