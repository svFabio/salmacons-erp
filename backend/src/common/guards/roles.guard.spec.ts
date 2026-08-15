import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { RolUsuario } from '@prisma/client';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;
    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow if no roles required', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should deny if role mismatch', () => {
    reflector.getAllAndOverride.mockReturnValue([RolUsuario.ADMIN]);
    const mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { rol: RolUsuario.CLIENTE } })
      })
    } as any;
    expect(guard.canActivate(mockContext)).toBe(false);
  });

  it('should allow if role matches', () => {
    reflector.getAllAndOverride.mockReturnValue([RolUsuario.ADMIN]);
    const mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { rol: RolUsuario.ADMIN } })
      })
    } as any;
    expect(guard.canActivate(mockContext)).toBe(true);
  });
});
