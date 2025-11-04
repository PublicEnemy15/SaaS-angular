import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainsDashboard } from '../domains/domains-dashboard';

@Component({
  selector: 'app-platform-page',
  standalone: true,
  imports: [CommonModule, DomainsDashboard],
  templateUrl: './platform.html',
  styleUrls: ['./platform.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformPage {}


