import { Component, ChangeDetectionStrategy, signal } from '@angular/core';  
import { CommonModule } from '@angular/common';  
import { RouterLink } from '@angular/router';
  
export interface Card {
  id: string;
  title: string;
  content: string;
  price: string;
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
  selectedCard = signal<string | null>(null);
  cards = signal<Card[]>([
    {
      id: 'plan-1',
      title: 'Básico',
      content: 'Ideal para proyectos personales. Incluye 1 web.',
      price: '$5'
    },
    {
      id: 'plan-2',
      title: 'Profesional',
      content: 'Perfecto para freelancers y pequeñas empresas. Incluye 5 webs.',
      price: '$20'
    },
    {
      id: 'plan-3',
      title: 'Business',
      content: 'La solución completa para agencias y grandes proyectos. Incluye 20 webs.',
      price: '$40'
    }
  ]);

  selectPlan(planId: string): void {
    this.selectedCard.set(planId);
  }
}