import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { of, throwError } from 'rxjs';
import { vi, Mocked } from 'vitest';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: Mocked<Partial<AuthService>>;
  let routerMock: Mocked<Partial<Router>>;

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn(),
      me: vi.fn(),
    } as unknown as Mocked<Partial<AuthService>>;

    routerMock = {
      navigate: vi.fn(),
    } as unknown as Mocked<Partial<Router>>;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        LoginComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should handle login success', async () => {
    authServiceMock.login.mockReturnValue(of({ access_token: 'test' }));
    authServiceMock.me.mockReturnValue(of({
      id: 'usr-1',
      email: 'test@salmacons.com',
      nombre: 'Test',
      apellido: 'User',
      rol: 'ADMIN',
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    component.loginForm.controls.email.setValue('test@test.com');
    component.loginForm.controls.password.setValue('pass');
    
    await component.onSubmit();
    
    expect(authServiceMock.login).toHaveBeenCalled();
    expect(authServiceMock.me).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app']);
  });

  it('should handle login error', async () => {
    authServiceMock.login.mockReturnValue(throwError(() => new Error('test')));
    
    component.loginForm.controls.email.setValue('test@test.com');
    component.loginForm.controls.password.setValue('pass');
    
    await component.onSubmit();
    
    expect(authServiceMock.login).toHaveBeenCalled();
    expect(component.errorMessage).toBe('Credenciales incorrectas');
    expect(component.loading).toBe(false);
  });
});
