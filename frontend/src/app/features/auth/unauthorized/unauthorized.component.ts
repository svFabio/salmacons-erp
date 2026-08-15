import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  template: `
    <div style="text-align: center; padding: 50px;">
      <h1>Acceso Denegado</h1>
      <p>No tienes permiso para ver esta página.</p>
      <a href="/app">Volver al inicio</a>
    </div>
  `
})
export class UnauthorizedComponent {}
