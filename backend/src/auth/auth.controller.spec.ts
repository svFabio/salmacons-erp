import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolUsuario } from '@prisma/client';
import { AuthUser } from './auth.types';

describe('AuthController', () => {
  let controller: AuthController;

  const loginMock = jest.fn().mockReturnValue({ access_token: 'token' });

  const mockAuthUser: AuthUser = {
    id: '1',
    email: 'test@test.com',
    nombre: 'Test',
    apellido: 'User',
    rol: RolUsuario.CLIENTE,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { login: loginMock },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call authService.login with the authenticated user', () => {
    const result = controller.login(
      { email: 'test@test.com', password: 'secret' },
      mockAuthUser,
    );

    expect(loginMock).toHaveBeenCalledWith(mockAuthUser);
    expect(result).toEqual({ access_token: 'token' });
  });
});
