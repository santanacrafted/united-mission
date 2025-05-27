import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidsProgramsComponent } from './kids-programs.component';

describe('KidsProgramsComponent', () => {
  let component: KidsProgramsComponent;
  let fixture: ComponentFixture<KidsProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KidsProgramsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KidsProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
