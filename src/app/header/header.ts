import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { UserActions } from '../user-actions/user-actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, UserActions, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header implements OnInit {
  readonly isMenuOpen = signal(false);
  readonly isLoggedIn = signal(false);
  url = signal('');

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.url.set(event.urlAfterRedirects.replace('/', ''));
      });
  }

  toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
