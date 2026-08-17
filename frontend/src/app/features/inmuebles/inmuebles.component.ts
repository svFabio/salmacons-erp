import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InmuebleService } from '../../core/services/inmueble.service';
import { Inmueble } from '../../core/models/inmueble.model';

@Component({
  selector: 'app-inmuebles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inmuebles.component.html',
  styleUrl: './inmuebles.component.scss',
})
export class InmueblesComponent implements OnInit {
  private inmuebleService = inject(InmuebleService);
  private fb = inject(FormBuilder);

  inmuebles: Inmueble[] = [];
  loading = true;
  error: string | null = null;
  editingId: string | null = null;
  form: FormGroup = this.fb.group({
    direccion: ['', Validators.required],
    matricula: [''],
    codigoCatastral: [''],
    superficie: [null as number | null],
    descripcion: [''],
  });

  ngOnInit(): void {
    this.loadInmuebles();
  }

  loadInmuebles(): void {
    this.loading = true;
    this.error = null;
    this.inmuebleService.findAll().subscribe({
      next: (data) => {
        this.inmuebles = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar inmuebles';
        this.loading = false;
      },
    });
  }

  startCreate(): void {
    this.editingId = null;
    this.form.reset({ direccion: '', matricula: '', codigoCatastral: '', superficie: null, descripcion: '' });
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
  }

  cancelForm(): void {
    this.editingId = null;
    this.form.reset();
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
          this.cancelForm();
          this.loadInmuebles();
        },
        error: () => {
          this.error = 'Error al actualizar inmueble';
        },
      });
    } else {
      this.inmuebleService.create(value).subscribe({
        next: () => {
          this.cancelForm();
          this.loadInmuebles();
        },
        error: () => {
          this.error = 'Error al crear inmueble';
        },
      });
    }
  }

  delete(id: string): void {
    this.inmuebleService.remove(id).subscribe({
      next: () => this.loadInmuebles(),
      error: () => {
        this.error = 'Error al eliminar inmueble';
      },
    });
  }
}
