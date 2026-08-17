import { Component, OnInit, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InmuebleService } from '../../core/services/inmueble.service';
import { LoggerService } from '../../core/services/logger.service';
import { Inmueble } from '../../core/models/inmueble.model';

@Component({
  selector: 'app-inmuebles',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './inmuebles.component.html',
  styleUrl: './inmuebles.component.scss',
})
export class InmueblesComponent implements OnInit {
  private inmuebleService = inject(InmuebleService);
  private logger = inject(LoggerService);
  private fb = inject(FormBuilder);

  inmuebles: Inmueble[] = [];
  loading = true;
  error: string | null = null;
  editingId: string | null = null;
  showDrawer = false;

  form = this.fb.group({
    direccion: ['', Validators.required],
    matricula: [''],
    codigoCatastral: [''],
    superficie: [null as number | null],
    descripcion: [''],
  });

  ngOnInit(): void {
    this.loadInmuebles();
  }

  onNuevoInmueble(): void {
    this.editingId = null;
    this.form.reset();
    this.showDrawer = true;
  }

  cerrarDrawer(): void {
    this.showDrawer = false;
    this.editingId = null;
    this.form.reset();
  }

  loadInmuebles(): void {
    this.loading = true;
    this.error = null;
    this.inmuebleService.findAll().subscribe({
      next: (data) => {
        this.inmuebles = data;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.logger.error('InmueblesComponent.loadInmuebles', err);
        this.error = 'Error al cargar inmuebles';
        this.loading = false;
      },
    });
  }

  startEdit(inmueble: Inmueble): void {
    this.editingId = inmueble.id;
    this.form.patchValue({
      direccion: inmueble.direccion,
      matricula: inmueble.matricula ?? '',
      codigoCatastral: inmueble.codigoCatastral ?? '',
      superficie: inmueble.superficie ?? null,
      descripcion: inmueble.descripcion ?? '',
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
      this.inmuebleService.update(this.editingId, value).subscribe({
        next: () => {
          this.cerrarDrawer();
          this.loadInmuebles();
        },
        error: (err: unknown) => {
          this.logger.error('InmueblesComponent.save (update)', err);
          this.error = 'Error al actualizar inmueble';
        },
      });
    } else {
      this.inmuebleService.create(value).subscribe({
        next: () => {
          this.cerrarDrawer();
          this.loadInmuebles();
        },
        error: (err: unknown) => {
          this.logger.error('InmueblesComponent.save (create)', err);
          this.error = 'Error al crear inmueble';
        },
      });
    }
  }

  delete(id: string): void {
    this.inmuebleService.remove(id).subscribe({
      next: () => this.loadInmuebles(),
      error: (err: unknown) => {
        this.logger.error('InmueblesComponent.delete', err);
        this.error = 'Error al eliminar inmueble';
      },
    });
  }
}
