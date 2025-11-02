import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-actions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-actions.html',
  styleUrls: ['./user-actions.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActions {
  @Input() url: string = '';
  @Input() isLoggedIn = false;
}
