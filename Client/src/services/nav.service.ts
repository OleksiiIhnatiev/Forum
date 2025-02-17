import { Injectable } from '@angular/core';
import { INavLink } from '../app/interfaces/nav-link.interface';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  private navLinks: INavLink[] = [
    { label: 'HOME', href: '#' },
    { label: 'ABOUT', href: '#about' },
  ];

  public getNavLinks(): INavLink[] {
    return this.navLinks;
  }
}
