import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';

export type StepState = 'done' | 'active' | 'todo';

export type Step = {
  index: number;
  label: string;
  state: StepState;
  clickable: boolean;
};

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './stepper.html',
  styleUrls: ['./stepper.css'],
})
export class StepperComponent {
  @Input({ required: true }) steps!: Step[];
  @Output() stepClick = new EventEmitter<number>();

  onClick(step: Step): void {
    if (!step.clickable) return;
    this.stepClick.emit(step.index);
  }
}
