import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepVehicle } from './step-vehicle';

describe('StepVehicle', () => {
  let component: StepVehicle;
  let fixture: ComponentFixture<StepVehicle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepVehicle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepVehicle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
