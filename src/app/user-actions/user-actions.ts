import { Component, ChangeDetectionStrategy, Input, computed, signal } from '@angular/core';
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

  constructor(private router: Router) {
    this.checkIfInDashboard();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkIfInDashboard();
      });
  }
  private checkIfInDashboard(): void {
    const url = this.router.url;
    this.isInDashboard.set(url.startsWith('/platform'));
  }
}

