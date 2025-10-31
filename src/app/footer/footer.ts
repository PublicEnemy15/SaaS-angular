import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class Footer {
  /**
   * Smoothly scroll the page to the top. Kept simple and safe for SSR checks.
   */
  goToTop(): void {
    if (typeof window !== 'undefined' && window?.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
