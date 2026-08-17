import { Component, inject } from '@angular/core';

import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BrandService } from '../../core/services/brand.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  public brand = inject(BrandService);

  role = this.authService.getCurrentRole();

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
