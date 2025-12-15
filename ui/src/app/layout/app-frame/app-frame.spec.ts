import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFrameComponent } from './app-frame';

describe('AppFrame', () => {
  let component: AppFrameComponent;
  let fixture: ComponentFixture<AppFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFrameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFrameComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
