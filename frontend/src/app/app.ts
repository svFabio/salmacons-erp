import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrandService } from './core/services/brand.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public brand = inject(BrandService);

  constructor() {
    this.brand.applyBrandColors();
  }
}
