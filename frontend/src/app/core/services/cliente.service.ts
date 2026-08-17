import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/clientes`;

  findAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.baseUrl);
  }

  findById(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  create(data: Pick<Cliente, 'nombres' | 'apellidos' | 'ci'> & Partial<Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>>): Observable<Cliente> {
    return this.http.post<Cliente>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>>): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.baseUrl}/${id}`, data);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
