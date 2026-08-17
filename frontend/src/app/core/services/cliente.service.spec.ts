import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ClienteService } from './cliente.service';
import { Cliente } from '../models/cliente.model';
import { environment } from '../../../environments/environment';

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;

  const mockCliente: Cliente = {
    id: '1',
    nombres: 'Juan',
    apellidos: 'Perez',
    ci: '1234567',
    email: 'juan@test.com',
    telefono: '555-0001',
    direccion: 'Calle Falsa 123',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClienteService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all clientes', () => {
    service.findAll().subscribe((clientes) => {
      expect(clientes).toEqual([mockCliente]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clientes`);
    expect(req.request.method).toBe('GET');
    req.flush([mockCliente]);
  });

  it('should fetch cliente by id', () => {
    service.findById('1').subscribe((cliente) => {
      expect(cliente).toEqual(mockCliente);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clientes/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCliente);
  });

  it('should create a cliente', () => {
    const dto = { nombres: 'Juan', apellidos: 'Perez', ci: '1234567' };

    service.create(dto).subscribe((cliente) => {
      expect(cliente).toEqual(mockCliente);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clientes`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockCliente);
  });

  it('should update a cliente', () => {
    const dto = { nombres: 'Juan Actualizado' };

    service.update('1', dto).subscribe((cliente) => {
      expect(cliente).toEqual(mockCliente);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clientes/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(dto);
    req.flush(mockCliente);
  });

  it('should delete a cliente', () => {
    service.remove('1').subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/clientes/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
