import { routes } from './app.routes';
import { roleGuard } from './core/guards/role.guard';

describe('App Routes', () => {
  it('should have roleGuard on directorio route with specific roles', () => {
    const appRoute = routes.find(r => r.path === 'app');
    expect(appRoute).toBeDefined();
    
    const dirRoute = appRoute?.children?.find(r => r.path === 'directorio');
    expect(dirRoute).toBeDefined();
    expect(dirRoute?.canActivate).toContain(roleGuard);
    expect(dirRoute?.data?.['roles']).toEqual(['ADMIN', 'ABOGADO', 'ARQUITECTO']);
  });
});
