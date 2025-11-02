import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserActions } from '../user-actions/user-actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, UserActions],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
