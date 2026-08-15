import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  get name(): string {
    return environment.brand.name;
  }

  get logoPath(): string {
    return environment.brand.logoPath;
  }

  applyBrandColors(): void {
    const root = document.documentElement;
    const colors = environment.brand.colors;
    
    root.style.setProperty('--c-primary', colors.primary);
    root.style.setProperty('--c-primary-hover', colors.primaryHover);
    root.style.setProperty('--c-accent', colors.accent);
    root.style.setProperty('--c-accent-hover', colors.accentHover);
    root.style.setProperty('--c-dark', colors.dark);
  }
}
