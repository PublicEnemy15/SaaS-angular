
import { Component, ChangeDetectionStrategy, Input, signal, OnInit } from '@angular/core';
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
export class PlatformPage implements OnInit{
  // Signals para mostrar el plan y dominio seleccionado
  readonly selectedPlan = signal<string>('');
  readonly selectedDomain = signal<string>('');

  // Simulación: en producción, estos datos vendrían de un servicio o localStorage
  ngOnInit() {
    // Recuperar datos del plan y dominio (ejemplo)
    const plan = localStorage.getItem('selectedPlan');
    const domain = localStorage.getItem('selectedDomain');
    if (plan) this.selectedPlan.set(plan);
    if (domain) this.selectedDomain.set(domain);
  }
}


