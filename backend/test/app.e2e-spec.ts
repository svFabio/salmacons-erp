import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('auth/me (e2e)', () => {
    it('should reject unauthenticated requests with 401', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('should return the current user from a valid JWT', async () => {
      const jwtService = app.get<JwtService>(JwtService);
      const token = jwtService.sign({
        sub: 'usr-1',
        email: 'test@test.com',
        rol: 'CLIENTE',
      });

      const res = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toEqual(
        expect.objectContaining({
          email: 'test@test.com',
          rol: 'CLIENTE',
        }),
      );
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
