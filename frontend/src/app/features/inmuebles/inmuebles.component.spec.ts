import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { InmueblesComponent } from './inmuebles.component';
import { LoggerService } from '../../core/services/logger.service';
import { Inmueble } from '../../core/models/inmueble.model';
import { environment } from '../../../environments/environment';

describe('InmueblesComponent', () => {
  let component: InmueblesComponent;
  let fixture: ComponentFixture<InmueblesComponent>;
  let httpMock: HttpTestingController;
  let loggerSpy: { error: jest.Mock; warn: jest.Mock };

  const mockInmuebles: Inmueble[] = [
    {
      id: '1',
      direccion: 'Av. Principal 456',
      matricula: 'MAT-001',
      codigoCatastral: 'CC-001',
      superficie: 120,
      descripcion: 'Departamento 3 ambientes',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];

  beforeEach(async () => {
    loggerSpy = { error: jest.fn(), warn: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [InmueblesComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LoggerService, useValue: loggerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InmueblesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadInmuebles', () => {
    it('should load inmuebles on init', () => {
      fixture.detectChanges();

      const req = httpMock.expectOne(`${environment.apiUrl}/inmuebles`);
      expect(req.request.method).toBe('GET');
      req.flush(mockInmuebles);

      expect(component.inmuebles.length).toBe(1);
      expect(component.loading).toBeFalsy();
    });

    it('should set error and log when load fails', () => {
      fixture.detectChanges();

      const req = httpMock.expectOne(`${environment.apiUrl}/inmuebles`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(component.error).toBe('Error loading properties');
      expect(component.loading).toBeFalsy();
      expect(loggerSpy.error).toHaveBeenCalledWith(
        'InmueblesComponent.loadInmuebles',
        expect.anything(),
      );
    });
  });

  describe('drawer', () => {
    beforeEach(() => {
      fixture.detectChanges();
      httpMock.expectOne(`${environment.apiUrl}/inmuebles`).flush([]);
    });

    it('onNuevoInmueble should open drawer and reset form', () => {
      component.editingId = '1';
      component.onNuevoInmueble();
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
      component.startEdit(mockInmuebles[0]);
      expect(component.showDrawer).toBe(true);
      expect(component.editingId).toBe('1');
      expect(component.form.get('direccion')?.value).toBe('Av. Principal 456');
      expect(component.form.get('superficie')?.value).toBe(120);
    });
  });

  describe('save', () => {
    beforeEach(() => {
      fixture.detectChanges();
      httpMock.expectOne(`${environment.apiUrl}/inmuebles`).flush([]);
    });

    it('should mark form as touched and not submit when invalid', () => {
      component.save();
      expect(component.form.get('direccion')?.touched).toBeTruthy();
    });

    it('should call create when editingId is null', () => {
      component.form.patchValue({ direccion: 'Calle Nueva 123' });
      component.save();

      const req = httpMock.expectOne(`${environment.apiUrl}/inmuebles`);
      expect(req.request.method).toBe('POST');
      req.flush(mockInmuebles[0]);

      httpMock.expectOne(`${environment.apiUrl}/inmuebles`).flush([]);
      expect(component.showDrawer).toBe(false);
    });

    it('should log and set error when create fails', () => {
      component.form.patchValue({ direccion: 'Calle Nueva 123' });
      component.save();

      const req = httpMock.expectOne(`${environment.apiUrl}/inmuebles`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(component.error).toBe('Error creating property');
      expect(loggerSpy.error).toHaveBeenCalledWith(
        'InmueblesComponent.save (create)',
        expect.anything(),
      );
    });

    it('should call update when editingId is set', () => {
      component.editingId = '1';
      component.form.patchValue({ direccion: 'Calle Actualizada 456' });
      component.save();

      const req = httpMock.expectOne(`${environment.apiUrl}/inmuebles/1`);
      expect(req.request.method).toBe('PATCH');
      req.flush(mockInmuebles[0]);

      httpMock.expectOne(`${environment.apiUrl}/inmuebles`).flush([]);
      expect(component.showDrawer).toBe(false);
    });

    it('should log and set error when update fails', () => {
      component.editingId = '1';
      component.form.patchValue({ direccion: 'Calle Actualizada 456' });
      component.save();

      const req = httpMock.expectOne(`${environment.apiUrl}/inmuebles/1`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(component.error).toBe('Error updating property');
      expect(loggerSpy.error).toHaveBeenCalledWith(
        'InmueblesComponent.save (update)',
        expect.anything(),
      );
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      fixture.detectChanges();
      httpMock.expectOne(`${environment.apiUrl}/inmuebles`).flush(mockInmuebles);
    });

    it('should reload inmuebles after successful delete', () => {
      component.delete('1');

      const deleteReq = httpMock.expectOne(`${environment.apiUrl}/inmuebles/1`);
      expect(deleteReq.request.method).toBe('DELETE');
      deleteReq.flush(null);

      httpMock.expectOne(`${environment.apiUrl}/inmuebles`).flush([]);
      expect(component.inmuebles).toEqual([]);
    });

    it('should log and set error when delete fails', () => {
      component.delete('1');

      const req = httpMock.expectOne(`${environment.apiUrl}/inmuebles/1`);
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(component.error).toBe('Error deleting property');
      expect(loggerSpy.error).toHaveBeenCalledWith(
        'InmueblesComponent.delete',
        expect.anything(),
      );
    });
  });
});
