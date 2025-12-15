import { Component, EventEmitter, Input, Output } from '@angular/core';
import {NgFor, NgClass, NgIf} from '@angular/common';

export type VehicleType = 'PKW' | 'LKW' | 'MOTORRAD' | 'WOHNMOBIL';

type Tile = {
  type: VehicleType;
  title: string;
  subtitle: string;
  icon: string;
};

@Component({
  selector: 'app-step-vehicle',
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
  templateUrl: './step-vehicle.html',
  styleUrls: ['./step-vehicle.css'],
})
export class StepVehicleComponent {
  @Input() selected: VehicleType | null = null;

  @Output() selectedChange = new EventEmitter<VehicleType>();
  @Output() next = new EventEmitter<void>();

  @Input() busy = false;


  tiles: Tile[] = [
    { type: 'PKW', title: 'PKW', subtitle: 'Passenger car', icon: 'directions_car' },
    { type: 'LKW', title: 'LKW', subtitle: 'Truck',         icon: 'local_shipping' },
    { type: 'MOTORRAD', title: 'MOTORRAD', subtitle: 'Motorcycle', icon: 'two_wheeler' },
    { type: 'WOHNMOBIL', title: 'WOHNMOBIL', subtitle: 'Camper',   icon: 'airport_shuttle' },
  ];

  choose(type: VehicleType): void {
    this.selected = type;
    this.selectedChange.emit(type);
  }

  canNext(): boolean {
    return !this.busy && this.selected !== null;
  }

  onNext(): void {
    if (this.busy) return;
    if (!this.canNext()) return;
    this.next.emit();
  }
}
