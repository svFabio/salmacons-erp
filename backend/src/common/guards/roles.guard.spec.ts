import { RolesGuard } from './roles.guard';
import { RolUsuario } from '@prisma/client';
import { ExecutionContext } from '@nestjs/common';

function createReflectorMock() {
  return {
    get: jest.fn(),
    getAll: jest.fn(),
    getAllAndOverride: jest.fn(),
    getAllAndMerge: jest.fn(),
  };
}

function createMockContext(user?: { rol: RolUsuario }): ExecutionContext {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    getType: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
      getNext: () => undefined,
      getResponse: () => undefined,
    }),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  function setupGuard() {
    const reflector = createReflectorMock();
    return { guard: new RolesGuard(reflector), reflector };
  }

  it('should be defined', () => {
    const { guard } = setupGuard();
    expect(guard).toBeDefined();
  });

  it('should allow if no roles required', () => {
    const { guard, reflector } = setupGuard();
    reflector.getAllAndOverride.mockReturnValue(undefined);
    expect(guard.canActivate(createMockContext())).toBe(true);
  });

  it('should deny if role mismatch', () => {
    const { guard, reflector } = setupGuard();
    reflector.getAllAndOverride.mockReturnValue([RolUsuario.ADMIN]);
    expect(
      guard.canActivate(createMockContext({ rol: RolUsuario.CLIENTE })),
    ).toBe(false);
  });

  it('should allow if role matches', () => {
    const { guard, reflector } = setupGuard();
    reflector.getAllAndOverride.mockReturnValue([RolUsuario.ADMIN]);
    expect(
      guard.canActivate(createMockContext({ rol: RolUsuario.ADMIN })),
    ).toBe(true);
  });

  it('should deny if there is no authenticated user', () => {
    const { guard, reflector } = setupGuard();
    reflector.getAllAndOverride.mockReturnValue([RolUsuario.ADMIN]);
    expect(guard.canActivate(createMockContext())).toBe(false);
  });
});
