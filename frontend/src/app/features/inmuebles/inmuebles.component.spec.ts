import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { InmueblesComponent } from './inmuebles.component';
import { Inmueble } from '../../core/models/inmueble.model';
import { environment } from '../../../environments/environment';

describe('InmueblesComponent', () => {
  let component: InmueblesComponent;
  let fixture: ComponentFixture<InmueblesComponent>;
  let httpMock: HttpTestingController;

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
    await TestBed.configureTestingModule({
      imports: [InmueblesComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
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

  it('should load inmuebles on init', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiUrl}/inmuebles`);
    expect(req.request.method).toBe('GET');
    req.flush(mockInmuebles);

    expect(component.inmuebles.length).toBe(1);
    expect(component.loading).toBeFalsy();
  });

  it('should show error when load fails', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiUrl}/inmuebles`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(component.error).toBe('Error al cargar inmuebles');
    expect(component.loading).toBeFalsy();
  });
});
