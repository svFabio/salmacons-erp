import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { UnauthorizedComponent } from './features/auth/unauthorized/unauthorized.component';
import { ShellComponent } from './layout/shell/shell.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { ClientesComponent } from './features/clientes/clientes.component';
import { InmueblesComponent } from './features/inmuebles/inmuebles.component';
import { TramitesComponent } from './features/tramites/tramites.component';
import { UsuariosComponent } from './features/usuarios/usuarios.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: 'app',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'clientes', component: ClientesComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'ABOGADO', 'ARQUITECTO'] } },
      { path: 'inmuebles', component: InmueblesComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'ABOGADO', 'ARQUITECTO', 'CLIENTE'] } },
      { path: 'tramites', component: TramitesComponent, canActivate: [roleGuard], data: { roles: ['ADMIN', 'ABOGADO', 'ARQUITECTO'] } },
      { path: 'usuarios', component: UsuariosComponent, canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
      { path: '', redirectTo: 'inmuebles', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
