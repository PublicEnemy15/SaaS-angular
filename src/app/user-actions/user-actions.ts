import { Component, ChangeDetectionStrategy, Input, computed, signal, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-actions',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './user-actions.html',
  styleUrls: ['./user-actions.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActions implements OnInit, OnDestroy {
  @Input() url: string = '';      
  readonly isInDashboard = signal(false);
  readonly isAuthenticated = signal(false);
  
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.checkIfInDashboard();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.checkIfInDashboard();
        this.cdr.markForCheck();
      });
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        this.isAuthenticated.set(isAuth);
        this.cdr.markForCheck();
      });

    this.isAuthenticated.set(this.authService.isAuthenticated());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private checkIfInDashboard(): void {
    const url = this.router.url;
    // Ocultar botones en platform, tier y dashboard/comments (excepto el botón plataforma en home)
    this.isInDashboard.set(url.startsWith('/platform') || url.startsWith('/tier') || url.startsWith('/dashboard/comments'));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.cdr.markForCheck();
  }
}