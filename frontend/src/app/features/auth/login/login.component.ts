import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BrandService } from '../../../core/services/brand.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  public brand = inject(BrandService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  errorMessage = '';
  loading = false;

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      try {
        await firstValueFrom(this.authService.login({
          email: this.loginForm.value.email!,
          password: this.loginForm.value.password!
        }));
        
        try {
          await firstValueFrom(this.authService.me());
          await this.router.navigate(['/app']);
          this.loading = false;
        } catch (err: unknown) {
          this.loading = false;
          this.errorMessage = 'Error obteniendo datos del usuario';
        }
      } catch (err: unknown) {
        this.loading = false;
        this.errorMessage = 'Credenciales incorrectas';
      }
    }
  }
}
