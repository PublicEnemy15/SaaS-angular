import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Hero {
  protected readonly heroImage = {
    src: '/hero.webp',
    alt: 'Hero Banner',
    fetchPriority: 'high' as const,
    loading: 'eager' as const
  };

  protected readonly navigationUrl = '/';

  constructor() {}

  protected trackByFn(index: number): number {
    return index;
  }
}
