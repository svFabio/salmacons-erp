import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ClientesComponent } from './clientes.component';
import { LoggerService } from '../../core/services/logger.service';
import { Cliente } from '../../core/models/cliente.model';
import { environment } from '../../../environments/environment';

describe('ClientesComponent', () => {
  let component: ClientesComponent;
  let fixture: ComponentFixture<ClientesComponent>;
  let httpMock: HttpTestingController;
  let loggerSpy: { error: ReturnType<typeof vi.fn>; warn: ReturnType<typeof vi.fn> };

  const mockClientes: Cliente[] = [
    {
      id: '1',
      nombres: 'Juan',
      apellidos: 'Perez',
      ci: '1234567',
      email: 'juan@test.com',
      telefono: '555-0001',
      direccion: 'Calle 1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];

  beforeEach(async () => {
    loggerSpy = { error: vi.fn(), warn: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ClientesComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LoggerService, useValue: loggerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadClientes', () => {
    it('should load clientes on init', () => {
      fixture.detectChanges();

      const req = httpMock.expectOne(`${environment.apiUrl}/clientes`);
      expect(req.request.method).toBe('GET');
      req.flush(mockClientes);

      expect(component.clientes.length).toBe(1);
      expect(component.loading).toBeFalsy();
    });

    it('should set error and log when load fails', () => {
      fixture.detectChanges();

      const req = httpMock.expectOne(`${environment.apiUrl}/clientes`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(component.error).toBe('Error al cargar clientes');
      expect(component.loading).toBeFalsy();
      expect(loggerSpy.error).toHaveBeenCalledWith(
        'ClientesComponent.loadClientes',
        expect.anything(),
      );
    });
  });

  describe('drawer', () => {
    beforeEach(() => {
      fixture.detectChanges();
      httpMock.expectOne(`${environment.apiUrl}/clientes`).flush([]);
    });

    it('onNuevoCliente should open drawer and reset form', () => {
      component.editingId = '1';
      component.onNuevoCliente();
      expect(component.showDrawer).toBe(true);
      expect(component.editingId).toBeNull();
    });

    it('cerrarDrawer should close drawer and reset state', () => {
      component.showDrawer = true;
      component.editingId = '1';
      component.cerrarDrawer();
      expect(component.showDrawer).toBe(false);
      expect(component.editingId).toBeNull();
    });

    it('startEdit should populate form and open drawer', () => {
      component.startEdit(mockClientes[0]);
      expect(component.showDrawer).toBe(true);
      expect(component.editingId).toBe('1');
      expect(component.form.get('nombres')?.value).toBe('Juan');
    });
  });

  describe('save', () => {
    beforeEach(() => {
      fixture.detectChanges();
      httpMock.expectOne(`${environment.apiUrl}/clientes`).flush([]);
    });

    it('should mark form as touched and not submit when invalid', () => {
      component.save();
      expect(component.form.touched).toBeTruthy();
      expect(component.form.get('nombres')?.touched).toBeTruthy();
    });

    it('should call create when editingId is null', () => {
      component.form.setValue({
        nombres: 'Ana', apellidos: 'Rios', ci: '7654321',
        email: '', telefono: '', direccion: '',
      });
      component.save();

      const req = httpMock.expectOne(`${environment.apiUrl}/clientes`);
      expect(req.request.method).toBe('POST');
      req.flush(mockClientes[0]);

      httpMock.expectOne(`${environment.apiUrl}/clientes`).flush([]);
      expect(component.showDrawer).toBe(false);
    });

    it('should log and set error when create fails', () => {
      component.form.setValue({
        nombres: 'Ana', apellidos: 'Rios', ci: '7654321',
        email: '', telefono: '', direccion: '',
      });
      component.save();

      const req = httpMock.expectOne(`${environment.apiUrl}/clientes`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(component.error).toBe('Error al crear cliente');
      expect(loggerSpy.error).toHaveBeenCalledWith(
        'ClientesComponent.save (create)',
        expect.anything(),
      );
    });

    it('should call update when editingId is set', () => {
      component.editingId = '1';
      component.form.setValue({
        nombres: 'Ana', apellidos: 'Rios', ci: '7654321',
        email: '', telefono: '', direccion: '',
      });
      component.save();

      const req = httpMock.expectOne(`${environment.apiUrl}/clientes/1`);
      expect(req.request.method).toBe('PATCH');
      req.flush(mockClientes[0]);

      httpMock.expectOne(`${environment.apiUrl}/clientes`).flush([]);
      expect(component.showDrawer).toBe(false);
    });

    it('should log and set error when update fails', () => {
      component.editingId = '1';
      component.form.setValue({
        nombres: 'Ana', apellidos: 'Rios', ci: '7654321',
        email: '', telefono: '', direccion: '',
      });
      component.save();

      const req = httpMock.expectOne(`${environment.apiUrl}/clientes/1`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(component.error).toBe('Error al actualizar cliente');
      expect(loggerSpy.error).toHaveBeenCalledWith(
        'ClientesComponent.save (update)',
        expect.anything(),
      );
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      fixture.detectChanges();
      httpMock.expectOne(`${environment.apiUrl}/clientes`).flush(mockClientes);
    });

    it('should reload clientes after successful delete', () => {
      component.delete('1');

      const deleteReq = httpMock.expectOne(`${environment.apiUrl}/clientes/1`);
      expect(deleteReq.request.method).toBe('DELETE');
      deleteReq.flush(null);

      httpMock.expectOne(`${environment.apiUrl}/clientes`).flush([]);
      expect(component.clientes).toEqual([]);
    });

    it('should log and set error when delete fails', () => {
      component.delete('1');

      const req = httpMock.expectOne(`${environment.apiUrl}/clientes/1`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(component.error).toBe('Error al eliminar cliente');
      expect(loggerSpy.error).toHaveBeenCalledWith(
        'ClientesComponent.delete',
        expect.anything(),
      );
    });
  });
});
