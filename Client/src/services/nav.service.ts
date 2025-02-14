import { Injectable } from '@angular/core';

interface NavLink {
  label: string;
  href: string;
}

@Injectable({
  providedIn: 'root',
})
export class NavService {
  private navLinks: NavLink[] = [
    { label: 'HOME', href: '#' },
    { label: 'ABOUT', href: '#about' },
  ];

  getNavLinks(): NavLink[] {
    return this.navLinks;
  }
}
