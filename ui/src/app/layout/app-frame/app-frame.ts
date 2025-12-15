import { Component } from '@angular/core';
import { SidebarMenuComponent } from '../sidebar-menu/sidebar-menu';
import {WizardLayoutComponent} from '../../wizard/wizard-layout/wizard-layout';

@Component({
  selector: 'app-app-frame',
  standalone: true,
  imports: [SidebarMenuComponent, WizardLayoutComponent],
  templateUrl: './app-frame.html',
  styleUrls: ['./app-frame.css'],
})
export class AppFrameComponent {}
