import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../login/login.component';
import { RegistrationComponent } from '../../registration/registration.component';
import { NavService } from '../../../../services/nav.service';

@Component({
  selector: 'pn-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  public isScrolled = false;
  public isLoggedIn: boolean;
  public navLinks: { label: string; href: string }[];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService,
    private dialog: MatDialog,
    private navService: NavService
  ) {}

  public ngOnInit() {
    this.authService.authStatusSubject.subscribe(
      (status) => (this.isLoggedIn = status)
    );

    this.isLoggedIn = this.authService.isLoggedIn();
    this.navLinks = this.navService.getNavLinks();
  }

  @HostListener('window:scroll', [])
  public onWindowScroll() {
    this.isScrolled = this.document.documentElement.scrollTop > 0;
  }

  public login() {
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe((result) => (this.isLoggedIn = !!result));
  }

  public register() {
    const dialogRef = this.dialog.open(RegistrationComponent);
    dialogRef.afterClosed().subscribe((result) => (this.isLoggedIn = !!result));
  }

  public logout() {
    this.authService.logout().subscribe({
      next: () => (this.isLoggedIn = false),
      error: () => console.error('Logout failed'),
    });
  }
}
