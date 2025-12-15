import {Component, signal} from '@angular/core';
import { NgIf } from '@angular/common';
import {Step, StepperComponent} from '../stepper/stepper';
import {StepVehicleComponent, VehicleType} from '../step-vehicle/step-vehicle';
import {Step2Values, StepDetailsComponent} from '../step-details/step-details';
import {StepResultComponent} from '../step-result/step-result';

@Component({
  selector: 'app-wizard-layout',
  standalone: true,
  imports: [NgIf, StepperComponent, StepVehicleComponent, StepDetailsComponent, StepResultComponent],
  templateUrl: './wizard-layout.html',
  styleUrls: ['./wizard-layout.css'],
})
export class WizardLayoutComponent {
  activeTab: 1 | 2 = 1;

  tab2Enabled = false;

  currentStep: 1 | 2 | 3 = 1;
  step2: Step2Values = { kilometers: null, postcode: '' };

  transitioning = signal(false);

  private transition2s(action: () => void): void {
    if (this.transitioning()) return;
    this.transitioning.set(true);

    setTimeout(() => {
      action();
      this.transitioning.set(false);
    }, 1000);
  }

  selectTab(tab: 1 | 2): void {
    if (tab === 2 && !this.tab2Enabled) return;
    this.activeTab = tab;
  }

  steps: Step[] = [
    { index: 1, label: 'Step 1', state: 'active', clickable: true },
    { index: 2, label: 'Step 2', state: 'todo', clickable: false },
    { index: 3, label: 'Step 3', state: 'todo', clickable: false },
  ];

  vehicleType: VehicleType | null = null;

  onVehicleNext(): void {
    if (!this.vehicleType) return;

    this.transition2s(() => {
      this.currentStep = 2;

      this.steps = [
        { index: 1, label: 'Step 1', state: 'done', clickable: true },
        { index: 2, label: 'Step 2', state: 'active', clickable: true },
        { index: 3, label: 'Step 3', state: 'todo', clickable: false },
      ];
    });
  }

  onStep2Back(v: Step2Values): void {
    if (this.transitioning()) return;
    this.step2 = v;
    this.currentStep = 1;

    this.steps = [
      { index: 1, label: 'Step 1', state: 'active', clickable: true },
      { index: 2, label: 'Step 2', state: 'todo', clickable: false },
      { index: 3, label: 'Step 3', state: 'todo', clickable: false },
    ];
  }

  onStep2Next(v: Step2Values): void {
    this.step2 = v;

    this.transition2s(() => {
      this.currentStep = 3;

      this.steps = [
        { index: 1, label: 'Step 1', state: 'done', clickable: true },
        { index: 2, label: 'Step 2', state: 'done', clickable: true },
        { index: 3, label: 'Step 3', state: 'active', clickable: true },
      ];
    });
  }


  onResetAll(): void {
    this.transitioning.set(false);
    this.vehicleType = null;
    this.step2 = { kilometers: null, postcode: '' };
    this.currentStep = 1;

    this.steps = [
      { index: 1, label: 'Step 1', state: 'active', clickable: true },
      { index: 2, label: 'Step 2', state: 'todo', clickable: false },
      { index: 3, label: 'Step 3', state: 'todo', clickable: false },
    ];
  }

  backToStep2(): void {
    this.currentStep = 2;

    this.steps = [
      { index: 1, label: 'Step 1', state: 'done', clickable: true },
      { index: 2, label: 'Step 2', state: 'active', clickable: true },
      { index: 3, label: 'Step 3', state: 'todo', clickable: false },
    ];
  }

  onStep3Success(): void {
    this.steps = [
      { index: 1, label: 'Step 1', state: 'done', clickable: true },
      { index: 2, label: 'Step 2', state: 'done', clickable: true },
      { index: 3, label: 'Step 3', state: 'done', clickable: true },
    ];
  }

}
