import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User, AuthResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear local storage
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and set token', () => {
    const mockResponse: AuthResponse = { access_token: 'fake-jwt-token' };
    const credentials = { email: 'test@example.com', password: 'password123' };

    service.login(credentials).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(localStorage.getItem('salma_token')).toBe('fake-jwt-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should fetch current user and update state', () => {
    const mockUser: User = {
      id: '1',
      email: 'admin@salma.com',
      nombre: 'Admin',
      apellido: 'Salma',
      rol: 'ADMIN',
      activo: true
    };

    service.me().subscribe((user) => {
      expect(user).toEqual(mockUser);
      expect(service.currentUser$.value).toEqual(mockUser);
      expect(service.getCurrentRole()).toBe('ADMIN');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should logout and clear state', () => {
    localStorage.setItem('salma_token', 'fake-token');
    service.currentUser$.next({ id: '1', email: 'a@a.com', nombre: 'A', apellido: 'B', rol: 'ADMIN', activo: true });
    
    service.logout();
    
    expect(localStorage.getItem('salma_token')).toBeNull();
    expect(service.currentUser$.value).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });
});
