import { Component, ChangeDetectionStrategy, signal } from '@angular/core';  
import { CommonModule } from '@angular/common';  
import { RouterLink } from '@angular/router';
  
interface CardContent {  
  id: number;  
  title: string;  
  content: string;  
}  
  
@Component({  
  selector: 'app-cards',  
  standalone: true,  
  imports: [CommonModule, RouterLink],  
  templateUrl: './cards.html',  
  styleUrls: ['./cards.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush  
})  
export class Cards {  
  readonly selectedCard = signal<number>(1);

  readonly cards = signal<CardContent[]>([  
    {  
      id: 1,  
      title: 'Plan 1: Basico',   
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'  
    },  
    {  
      id: 2,  
      title: 'Plan 2: Intermedio',    
      content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'  
    },  
    {  
      id: 3,  
      title: 'Plan 3: Premium',    
      content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'  
    }  
  ]);  
  
  selectCard(id: number): void {  
    this.selectedCard.set(id);
    // Guarda el plan seleccionado en localStorage para usarlo en la plataforma
    const plan = this.cards().find(c => c.id === id)?.title || '';
    localStorage.setItem('selectedPlan', plan);
  }
}