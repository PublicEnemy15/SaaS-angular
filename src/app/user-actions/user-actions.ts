import { Component, ChangeDetectionStrategy, Input, computed, signal, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-user-actions',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './user-actions.html',
  styleUrls: ['./user-actions.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActions {
  @Input() url: string = '';      
  readonly isInDashboard = signal(false);

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.checkIfInDashboard();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkIfInDashboard();
        this.cdr.markForCheck();
      });
  }
  
  private checkIfInDashboard(): void {
    const url = this.router.url;
    // Ocultar botones en platform y tier
    this.isInDashboard.set(url.startsWith('/platform') || url.startsWith('/tier'));
  }
}

