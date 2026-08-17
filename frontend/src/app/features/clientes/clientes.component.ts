import { Component } from '@angular/core';

export interface ClienteResumen {
  id: string;
  nombres: string;
  apellidos: string;
  ci: string;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  fechaRegistro: string;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent {
  clientes: ClienteResumen[] = [
    {
      id: '1',
      nombres: 'Juan Carlos',
      apellidos: 'Pérez Gómez',
      ci: '1234567',
      email: 'juan.perez@email.com',
      telefono: '+591 71234567',
      direccion: 'Av. América #123',
      fechaRegistro: 'Hace 2 días'
    },
    {
      id: '2',
      nombres: 'María Elena',
      apellidos: 'Vargas',
      ci: '7654321',
      email: 'maria.vargas@email.com',
      telefono: '+591 61234567',
      direccion: 'Calle Lanza #45',
      fechaRegistro: 'Hace 1 semana'
    }
  ];

  onNuevoCliente(): void {
    // TBD: Abrir modal
  }

  onEditarCliente(id: string): void {
    // TBD: Abrir modal
  }

  onVerInmuebles(id: string): void {
    // TBD: Navegar a inmuebles
  }
}
