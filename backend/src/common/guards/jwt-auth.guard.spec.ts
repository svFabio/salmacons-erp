import { JwtAuthGuard } from './jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException if no user', () => {
    expect(() => guard.handleRequest(null, null, null)).toThrow(UnauthorizedException);
  });

  it('should return user if exists', () => {
    const user = { id: 1 };
    expect(guard.handleRequest(null, user, null)).toBe(user);
  });
});
