import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscoComponent } from './esco.component';

describe('EscoComponent', () => {
  let component: EscoComponent;
  let fixture: ComponentFixture<EscoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EscoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EscoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
