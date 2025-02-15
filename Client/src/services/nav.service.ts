import { Injectable } from '@angular/core';

// todo ai create separate folder interfaces, models. move interfaces to interfaces folder etc..
// todo ai name interfaces with I prefix
// todo ai add folder components. move there all components except app-component and components that are related to layout
interface NavLink {
  label: string;
  href: string;
}

// todo ai move this folder into app folder
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
