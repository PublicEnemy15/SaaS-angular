import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface CardContent {
  id: number;
  title: string;
  icon: string;
  description: string;
  content: string;
}

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './cards.html',
  styleUrls: ['./cards.scss'],
})
export class Cards {
  selectedCard = 1;
  
  cards: CardContent[] = [
    {
      id: 1,
      title: 'Plan 1',
      icon: 'auth-icon',
      description: 'Tu madre',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    {
      id: 2,
      title: 'Plan 2',
      icon: 'dashboard-icon',
      description: 'Tu madre',
      content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    {
      id: 3,
      title: 'Plan 3',
      icon: 'marketing-icon',
      description: 'Tu madre',
      content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
    }
  ];

  selectCard(id: number): void {
    this.selectedCard = id;
  }
}
