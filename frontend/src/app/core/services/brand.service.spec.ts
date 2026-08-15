import { TestBed } from '@angular/core/testing';
import { BrandService } from './brand.service';
import { environment } from '../../../environments/environment';

describe('BrandService', () => {
  let service: BrandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return brand name', () => {
    expect(service.name).toBe(environment.brand.name);
  });

  it('should return logo path', () => {
    expect(service.logoPath).toBe(environment.brand.logoPath);
  });

  it('should apply brand colors to document root', () => {
    service.applyBrandColors();
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--c-primary')).toBe(environment.brand.colors.primary);
    expect(root.style.getPropertyValue('--c-primary-hover')).toBe(environment.brand.colors.primaryHover);
    expect(root.style.getPropertyValue('--c-accent')).toBe(environment.brand.colors.accent);
    expect(root.style.getPropertyValue('--c-accent-hover')).toBe(environment.brand.colors.accentHover);
  });
});
