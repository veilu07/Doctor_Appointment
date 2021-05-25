import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorslotComponent } from './doctorslot.component';

describe('DoctorslotComponent', () => {
  let component: DoctorslotComponent;
  let fixture: ComponentFixture<DoctorslotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorslotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorslotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
