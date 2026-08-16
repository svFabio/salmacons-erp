import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectorioComponent } from './directorio.component';
import { provideRouter } from '@angular/router';

describe('DirectorioComponent', () => {
  let component: DirectorioComponent;
  let fixture: ComponentFixture<DirectorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorioComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
