import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { InmuebleService } from './inmueble.service';
import { Inmueble } from '../models/inmueble.model';
import { environment } from '../../../environments/environment';

describe('InmuebleService', () => {
  let service: InmuebleService;
  let httpMock: HttpTestingController;

  const mockInmueble: Inmueble = {
    id: '1',
    direccion: 'Av. Principal 456',
    matricula: 'MAT-001',
    codigoCatastral: 'CC-001',
    superficie: 120,
    descripcion: 'Departamento 3 ambientes',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InmuebleService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(InmuebleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all inmuebles', () => {
    service.findAll().subscribe((inmuebles) => {
      expect(inmuebles).toEqual([mockInmueble]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/inmuebles`);
    expect(req.request.method).toBe('GET');
    req.flush([mockInmueble]);
  });

  it('should fetch inmueble by id', () => {
    service.findById('1').subscribe((inmueble) => {
      expect(inmueble).toEqual(mockInmueble);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/inmuebles/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockInmueble);
  });

  it('should create an inmueble', () => {
    const dto = { direccion: 'Av. Principal 456' };

    service.create(dto).subscribe((inmueble) => {
      expect(inmueble).toEqual(mockInmueble);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/inmuebles`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockInmueble);
  });

  it('should update an inmueble', () => {
    const dto = { direccion: 'Av. Principal 789' };

    service.update('1', dto).subscribe((inmueble) => {
      expect(inmueble).toEqual(mockInmueble);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/inmuebles/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(dto);
    req.flush(mockInmueble);
  });

  it('should delete an inmueble', () => {
    service.remove('1').subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/inmuebles/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
