import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepResult } from './step-result';

describe('StepResult', () => {
  let component: StepResult;
  let fixture: ComponentFixture<StepResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
