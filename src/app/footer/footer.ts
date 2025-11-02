import { Component, ChangeDetectionStrategy } from '@angular/core';  
import { CommonModule } from '@angular/common';  
import { RouterModule } from '@angular/router';  
  
@Component({  
  selector: 'app-footer',  
  standalone: true,  
  imports: [CommonModule, RouterModule],  
  templateUrl: './footer.html',  
  styleUrls: ['./footer.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush  
})  
export class Footer {  
  goToTop(): void {  
    if (typeof window !== 'undefined' && window?.scrollTo) {  
      window.scrollTo({ top: 0, behavior: 'smooth' });  
    }  
  }  
}