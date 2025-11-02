import { ChangeDetectionStrategy, Component, signal } from '@angular/core';  
import { CommonModule } from '@angular/common';  
import { RouterLink } from '@angular/router'; 
import { UserActions } from '../user-actions/user-actions';  
  
@Component({  
  selector: 'app-header',  
  standalone: true,  
  imports: [CommonModule, UserActions, RouterLink],
  templateUrl: './header.html',  
  styleUrls: ['./header.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush 
})  

export class Header {  
  readonly isMenuOpen = signal<boolean>(false);  
  
  toggleMenu(): void {  
    this.isMenuOpen.update((v) => !v);  
  }  
  
  closeMenu(): void {  
    this.isMenuOpen.set(false);  
  }  
}