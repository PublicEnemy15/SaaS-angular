import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { HttpClient } from '@angular/common/http';

interface AddClientResponse {
  message: string;
}

@Component({
  selector: 'app-tier',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tier.html',
  styleUrls: ['./tier.scss']
})
export class Tier implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly http = inject(HttpClient);
  
  private readonly apiUrl = 'https://talkhubback.onrender.com';

  planName = '';
  planType = '';
  planId = '';
  domainInput = '';
  isSubmitting = false;
  errorMessage = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('plan');
      this.planId = id || '';
      this.updatePlan(id);
    });
  }

  updatePlan(id: string | null) {
    switch (id) {
      case '1':
        this.planName = 'Plan 1: Básico';
        this.planType = 'Plan Básico';
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

  onSubmit(event: Event) {
    event.preventDefault();
    
    if (this.isSubmitting) return;
    
    const form = event.target as HTMLFormElement;
    const domainInputEl = form.querySelector('input[type="text"]') as HTMLInputElement | null;
    const emailInputEl = form.querySelector('input[type="email"]') as HTMLInputElement | null;
    const passwordInputEl = form.querySelector('input[type="password"]') as HTMLInputElement | null;
    
    const domainValue = domainInputEl?.value?.trim() || '';
    const emailValue = emailInputEl?.value?.trim() || '';
    const passwordValue = passwordInputEl?.value?.trim() || '';

    // Validar credenciales locales
    const registeredEmail = localStorage.getItem('registeredEmail');
    const registeredPassword = localStorage.getItem('registeredPassword');
    
    if (emailValue !== registeredEmail || passwordValue !== registeredPassword) {
      this.errorMessage = 'El correo y/o la contraseña no coinciden con los datos de registro.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // 1. Crear el cliente con el tier seleccionado
    this.http.post<AddClientResponse>(
      `${this.apiUrl}/clients/addClient/${this.planId}`,
      {},
      { withCredentials: true }
    ).subscribe({
      next: () => {
        // Guardar plan en localStorage
        localStorage.setItem('selectedPlan', this.planName);

        // 2. Si hay dominio, agregarlo
        if (domainValue) {
          this.addDomainAndRedirect(domainValue);
        } else {
          this.router.navigate(['/platform']);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error creando cliente:', err);
        this.errorMessage = err.error?.error || 'Error al crear el cliente. Intenta nuevamente.';
      }
    });
  }

  private addDomainAndRedirect(domainValue: string) {
    // Normalizar dominio
    const normalized = this.normalizeToDomain(domainValue);
    
    this.http.post<any>(
      `${this.apiUrl}/dashboard/addWeb/${normalized}`,
      {},
      { withCredentials: true }
    ).subscribe({
      next: () => {
        localStorage.setItem('selectedDomain', normalized);
        this.router.navigate(['/platform']);
      },
      error: (err) => {
        console.error('Error añadiendo dominio:', err);
        // Guardar en localStorage como fallback
        localStorage.setItem('selectedDomain', normalized);
        const localDomains = localStorage.getItem('domains');
        let domainsArr = [];
        if (localDomains) {
          try {
            domainsArr = JSON.parse(localDomains);
          } catch {}
        }
        domainsArr.unshift({ 
          name: normalized, 
          createdAt: new Date().toISOString(), 
          commentsCount: 0 
        });
        localStorage.setItem('domains', JSON.stringify(domainsArr));
        this.router.navigate(['/platform']);
      }
    });
  }

  private normalizeToDomain(input: string): string {
    let value = input.trim().toLowerCase();
    value = value.replace(/^https?:\/\//, '');
    const slashIdx = value.indexOf('/');
    if (slashIdx !== -1) value = value.slice(0, slashIdx);
    return value;
  }
}