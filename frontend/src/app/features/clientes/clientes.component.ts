import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../core/services/cliente.service';
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
  private fb = inject(FormBuilder);

  clientes: Cliente[] = [];
  loading = true;
  error: string | null = null;
  editingId: string | null = null;
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

  showDrawer = false;

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
      error: () => {
        this.error = 'Error loading clients';
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
        error: () => {
          this.error = 'Error updating client';
        },
      });
    } else {
      this.clienteService.create(value).subscribe({
        next: () => {
          this.cerrarDrawer();
          this.loadClientes();
        },
        error: () => {
          this.error = 'Error creating client';
        },
      });
    }
  }

  delete(id: string): void {
    this.clienteService.remove(id).subscribe({
      next: () => this.loadClientes(),
      error: () => {
        this.error = 'Error al eliminar cliente';
      },
    });
  }
}
