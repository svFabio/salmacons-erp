import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesComponent } from './clientes.component';

describe('ClientesComponent', () => {
  let component: ClientesComponent;
  let fixture: ComponentFixture<ClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize mock data', () => {
    expect(component).toBeTruthy();
    expect(component.clientes.length).toBe(2);
    expect(component.clientes[0].ci).toBe('1234567');
  });

  it('should have void placeholder methods', () => {
    expect(() => component.onNuevoCliente()).not.toThrow();
    expect(() => component.onEditarCliente('1')).not.toThrow();
    expect(() => component.onVerInmuebles('1')).not.toThrow();
  });
});
