import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

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

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('plan');
      this.updatePlan(id);
    });
  }

  updatePlan(id: string | null) {
    switch (id) {
      case '1':
        this.planName = 'Plan 1: Basico';
        this.planType = 'Plan Basico';
        break;
      case '2':
        this.planName = 'Plan 2: Intermedio';
        this.planType = 'Plan Intermedio';
        break;
      case '3':
        this.planName = 'Plan 3: Premium';
        this.planType = 'Plan Premium';
        break;
      default:
        this.planName = '';
        this.planType = '';
    }
  }

  domainInput = '';

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const domainInputEl = form.querySelector('input[type="text"]') as HTMLInputElement | null;
    const emailInputEl = form.querySelector('input[type="email"]') as HTMLInputElement | null;
    const passwordInputEl = form.querySelector('input[type="password"]') as HTMLInputElement | null;
    const domainValue = domainInputEl?.value?.trim() || '';
    const emailValue = emailInputEl?.value?.trim() || '';
    const passwordValue = passwordInputEl?.value?.trim() || '';

    const registeredEmail = localStorage.getItem('registeredEmail');
    const registeredPassword = localStorage.getItem('registeredPassword');
    if (emailValue !== registeredEmail || passwordValue !== registeredPassword) {
      alert('El correo y/o la contraseña no coinciden con los datos de registro.');
      return;
    }

    localStorage.setItem('selectedPlan', this.planName);
    if (domainValue) {
      localStorage.setItem('selectedDomain', domainValue);
      this.api.addDomain({ name: domainValue, createdAt: new Date().toISOString(), commentsCount: 0 }).subscribe({
        next: () => {
          window.location.href = '/platform';
        },
        error: () => {
          // Guardar el dominio en localStorage si el backend falla
          const localDomains = localStorage.getItem('domains');
          let domainsArr = [];
          if (localDomains) {
            try {
              domainsArr = JSON.parse(localDomains);
            } catch {}
          }
          domainsArr.unshift({ name: domainValue, createdAt: new Date().toISOString(), commentsCount: 0 });
          localStorage.setItem('domains', JSON.stringify(domainsArr));
          window.location.href = '/platform';
        }
      });
    } else {
      window.location.href = '/platform';
    }
  }
}
