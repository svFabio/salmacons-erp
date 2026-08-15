import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { RolUsuario } from '@prisma/client';
import { UsuarioSinPassword } from './usuarios.types';

describe('UsuariosController', () => {
  let controller: UsuariosController;

  const createMock = jest.fn();

  const mockUser: UsuarioSinPassword = {
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
      controllers: [UsuariosController],
      providers: [
        {
          provide: UsuariosService,
          useValue: { create: createMock },
        },
      ],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the created user', async () => {
    createMock.mockResolvedValue(mockUser);

    const result = await controller.create({
      email: 'new@test.com',
      password: 'secret123',
      nombre: 'Test',
      apellido: 'User',
    });

    expect(result).toEqual(mockUser);
    expect(createMock).toHaveBeenCalled();
  });
});
