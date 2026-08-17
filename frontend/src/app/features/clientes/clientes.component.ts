import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../core/services/cliente.service';
import { LoggerService } from '../../core/services/logger.service';
import { Cliente } from '../../core/models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss',
})
export class ClientesComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private logger = inject(LoggerService);
  private fb = inject(FormBuilder);

  clientes: Cliente[] = [];
  loading = true;
  error: string | null = null;
  editingId: string | null = null;
  showDrawer = false;

  form: FormGroup = this.fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    ci: ['', Validators.required],
    email: [''],
    telefono: [''],
    direccion: [''],
  });

  ngOnInit(): void {
    this.loadClientes();
  }

  onNuevoCliente(): void {
    this.editingId = null;
    this.form.reset();
    this.showDrawer = true;
  }

  cerrarDrawer(): void {
    this.showDrawer = false;
    this.editingId = null;
    this.form.reset();
  }

  loadClientes(): void {
    this.loading = true;
    this.error = null;
    this.clienteService.findAll().subscribe({
      next: (data) => {
        this.clientes = data;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.logger.error('ClientesComponent.loadClientes', err);
        this.error = 'Error al cargar clientes';
        this.loading = false;
      },
    });
  }

  startEdit(cliente: Cliente): void {
    this.editingId = cliente.id;
    this.form.patchValue({
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      ci: cliente.ci,
      email: cliente.email ?? '',
      telefono: cliente.telefono ?? '',
      direccion: cliente.direccion ?? '',
    });
    this.showDrawer = true;
  }

  cancelForm(): void {
    this.cerrarDrawer();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    if (this.editingId) {
      this.clienteService.update(this.editingId, value).subscribe({
        next: () => {
          this.cerrarDrawer();
          this.loadClientes();
        },
        error: (err: unknown) => {
          this.logger.error('ClientesComponent.save (update)', err);
          this.error = 'Error al actualizar cliente';
        },
      });
    } else {
      this.clienteService.create(value).subscribe({
        next: () => {
          this.cerrarDrawer();
          this.loadClientes();
        },
        error: (err: unknown) => {
          this.logger.error('ClientesComponent.save (create)', err);
          this.error = 'Error al crear cliente';
        },
      });
    }
  }

  delete(id: string): void {
    this.clienteService.remove(id).subscribe({
      next: () => this.loadClientes(),
      error: (err: unknown) => {
        this.logger.error('ClientesComponent.delete', err);
        this.error = 'Error al eliminar cliente';
      },
    });
  }
}
