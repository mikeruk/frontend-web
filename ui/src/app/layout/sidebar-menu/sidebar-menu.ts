import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

type MenuLink = { label: string; url: string };
type MenuItem = { title: string; links: MenuLink[] };

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [NgFor],
  templateUrl: './sidebar-menu.html',
  styleUrls: ['./sidebar-menu.css'],
})
export class SidebarMenuComponent {
  items: MenuItem[] = [
    {
      title: 'Frontend Service',
      links: [{ label: 'Frontend docs', url: '/docs/frontend-docs.html' }],
    },
    {
      title: 'Offer Service',
      links: [{ label: 'Offer API docs', url: '/docs/offer-service-docs.html' }],
    },
    {
      title: 'Kalkulator Service - (externe API)',
      links: [
        { label: 'Calculator docs', url: '/docs/calculator-service-docs.html' },
        { label: 'Swagger UI', url: 'http://localhost:8282/swagger-ui.html' },
        { label: 'OpenAPI JSON', url: 'http://localhost:8282/v3/api-docs' },
      ],
    },
  ];

  // -1 means nothing expanded
  openIndex = 0;

  toggle(i: number): void {
    this.openIndex = this.openIndex === i ? -1 : i;
  }

  isOpen(i: number): boolean {
    return this.openIndex === i;
  }
}
