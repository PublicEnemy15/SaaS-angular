import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tier',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tier.html',
  styleUrls: ['./tier.scss']
})
export class Tier implements OnInit {

  planName = '';
  planType = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('plan');
      this.updatePlan(id);
    });
  }

  updatePlan(id: string | null) {
    switch (id) {
      case '1':
        this.planName = 'Contratar Plan 1';
        this.planType = 'Plan Basico';
        break;
      case '2':
        this.planName = 'Contratar Plan 2';
        this.planType = 'Plan Intermedio';
        break;
      case '3':
        this.planName = 'Contratar Plan 3';
        this.planType = 'Plan Premium';
        break;
      default:
        this.planName = 'Plan desconocido';
        this.planType = 'Selecciona un plan válido.';
    }
  }

  onSubmit(event: Event) {
    event.preventDefault(); // evita el envío nativo
    console.log('Formulario enviado para:', this.planName);
  }
}
