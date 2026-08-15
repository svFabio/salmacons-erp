import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShellComponent } from './shell.component';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { vi, Mocked } from 'vitest';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;
  let authServiceMock: Mocked<Partial<AuthService>>;
  let routerMock: Mocked<Partial<Router>>;

  beforeEach(async () => {
    authServiceMock = {
      logout: vi.fn(),
      getCurrentRole: vi.fn().mockReturnValue('ADMIN')
    } as unknown as Mocked<Partial<AuthService>>;

    routerMock = {
      navigate: vi.fn(),
    } as unknown as Mocked<Partial<Router>>;

    await TestBed.configureTestingModule({
      imports: [
        ShellComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call authService.logout and navigate on logout', () => {
    component.logout();
    
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
