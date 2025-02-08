import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../login/login.component';
import { RegistrationComponent } from '../../registration/registration.component';

@Component({
  selector: 'pn-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    // todo ai this looks like a strange thing that not meant to be at ts. this is a good approach to have a much of logic in typescript as possible, but it's not related to css things. as usual it is better to have it in css file. in this case we want to have this solution to work via css file
    trigger('backgroundStateTrigger', [
      state(
        'default',
        style({
          backgroundColor: 'transparent',
        })
      ),
      state(
        'highlighted',
        style({
          backgroundColor: '#ffffff',
        })
      ),
      transition('default <=> highlighted', animate(500)),
    ]),
  ],
})
export class NavbarComponent implements OnInit {
  public backgroundState = 'default';

  public isLoggedIn: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  public ngOnInit() {
    this.authService.authStatusSubject.subscribe(
      (status) => (this.isLoggedIn = status)
    );

    this.isLoggedIn = this.authService.isLoggedIn();
  }

  @HostListener('window:scroll', [])
  public onWindowScroll() {
    const isScrollAtStartPosition =
      this.document.documentElement.scrollTop === 0;

    if (isScrollAtStartPosition) {
      this.backgroundState = 'default';

      return;
    }
    this.backgroundState = 'highlighted';
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
