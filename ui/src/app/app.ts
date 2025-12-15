import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AppFrameComponent} from './layout/app-frame/app-frame';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppFrameComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('page');
}
