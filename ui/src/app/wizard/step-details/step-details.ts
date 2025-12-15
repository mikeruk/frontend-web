import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { NgIf } from '@angular/common';

export type Step2Values = {
  kilometers: number | null;
  postcode: string;
};

type Step2Form = FormGroup<{
  kilometers: FormControl<number | null>;
  postcode: FormControl<string>;
}>;

@Component({
  selector: 'app-step-details',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './step-details.html',
  styleUrls: ['./step-details.css'],
})
export class StepDetailsComponent {
  @Input() initial: Step2Values = { kilometers: null, postcode: '' };

  @Output() back = new EventEmitter<Step2Values>();
  @Output() next = new EventEmitter<Step2Values>();

  @Input() busy = false;


  form: Step2Form;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      kilometers: [this.initial.kilometers, [Validators.required, Validators.min(1), Validators.max(999999999)]],
      postcode: [this.initial.postcode ?? '', [Validators.required]],
    }) as Step2Form;
  }

  onBack(): void {
    if (this.busy) return;
    this.back.emit(this.values());
  }

  onNext(): void {
    if (this.busy) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.next.emit(this.values());
  }

  private values(): Step2Values {
    const v = this.form.getRawValue();
    return {
      kilometers: v.kilometers ?? null,
      postcode: (v.postcode ?? '').trim(),
    };
  }
}
