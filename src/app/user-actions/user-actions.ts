import { Component, ChangeDetectionStrategy } from '@angular/core';  
import { RouterLink } from '@angular/router';  
  
@Component({  
  selector: 'app-user-actions',  
  standalone: true,  
  imports: [RouterLink],  
  templateUrl: './user-actions.html',  
  styleUrls: ['./user-actions.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush  
})  
export class UserActions {}