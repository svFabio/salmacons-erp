import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inmueble } from '../models/inmueble.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InmuebleService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/inmuebles`;

  findAll(): Observable<Inmueble[]> {
    return this.http.get<Inmueble[]>(this.baseUrl);
  }

  findById(id: string): Observable<Inmueble> {
    return this.http.get<Inmueble>(`${this.baseUrl}/${id}`);
  }

  create(data: Pick<Inmueble, 'direccion'> & Partial<Omit<Inmueble, 'id' | 'createdAt' | 'updatedAt'>>): Observable<Inmueble> {
    return this.http.post<Inmueble>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Omit<Inmueble, 'id' | 'createdAt' | 'updatedAt'>>): Observable<Inmueble> {
    return this.http.patch<Inmueble>(`${this.baseUrl}/${id}`, data);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
