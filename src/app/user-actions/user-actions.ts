import { Component, ChangeDetectionStrategy, Input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  @Input() isLoggedIn = false;    
}

