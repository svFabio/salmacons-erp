import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RolUsuario } from '@prisma/client';
import { AuthUser } from './auth.types';

describe('AuthController', () => {
  let controller: AuthController;

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

  const loginMock = jest
    .fn<{ access_token: string; user: AuthUser }, [AuthUser]>()
    .mockReturnValue({ access_token: 'token', user: mockAuthUser });

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
    expect(result).toEqual({ access_token: 'token', user: mockAuthUser });
  });

  it('should propagate an authentication service error', () => {
    const error = new Error('authentication failed');
    loginMock.mockImplementationOnce(() => {
      throw error;
    });

    expect(() =>
      controller.login(
        { email: 'test@test.com', password: 'secret' },
        mockAuthUser,
      ),
    ).toThrow(error);
  });

  describe('me', () => {
    it('should return the current user from the JWT context', () => {
      expect(controller.me(mockAuthUser)).toEqual(mockAuthUser);
    });

    it('should be protected by JwtAuthGuard and RolesGuard', () => {
      const meHandler = Object.getOwnPropertyDescriptor(
        AuthController.prototype,
        'me',
      )?.value as object;
      const guards = Reflect.getMetadata('__guards__', meHandler) as unknown[];

      expect(guards).toContain(JwtAuthGuard);
      expect(guards).toContain(RolesGuard);
    });
  });
});
