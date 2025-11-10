import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from '../services/auth.service';

type TierLevel = '1' | '2' | '3';

interface TierInfo {
  id: TierLevel;
  name: string;
  displayName: string;
  features: string[];
}

@Component({
  selector: 'app-tier',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tier.html',
  styleUrls: ['./tier.scss']
})
export class Tier implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly dashboard = inject(DashboardService);
  private readonly auth = inject(AuthService);

  // Signals
  readonly selectedTier = signal<TierInfo | null>(null);
  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);

  // Form reactivo
  readonly tierForm: FormGroup;

  // Configuración de tiers
  private readonly tiers: Record<TierLevel, TierInfo> = {
    '1': {
      id: '1',
      name: 'basic',
      displayName: 'Plan Básico',
      features: ['1 dominio', '100 comentarios/mes', 'Soporte por email']
    },
    '2': {
      id: '2',
      name: 'intermediate',
      displayName: 'Plan Intermedio',
      features: ['5 dominios', '1000 comentarios/mes', 'Soporte prioritario', 'Moderación básica']
    },
    '3': {
      id: '3',
      name: 'premium',
      displayName: 'Plan Premium',
      features: ['Dominios ilimitados', 'Comentarios ilimitados', 'Soporte 24/7', 'Moderación avanzada', 'Personalización completa']
    }
  };

  constructor() {
    // Crear formulario reactivo
    this.tierForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      domain: ['', [Validators.pattern(/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/)]]
    });
  }

  ngOnInit(): void {
    // Observar cambios en la ruta
    this.route.paramMap.subscribe(params => {
      const tierId = params.get('plan') as TierLevel | null;
      this.updateTier(tierId);
    });
  }

  private updateTier(tierId: TierLevel | null): void {
    if (tierId && this.tiers[tierId]) {
      this.selectedTier.set(this.tiers[tierId]);
    } else {
      this.selectedTier.set(null);
      this.submitError.set('Plan no válido');
    }
  }

  async onSubmit(): Promise<void> {
    // Validar formulario
    if (this.tierForm.invalid) {
      this.submitError.set('Por favor completa todos los campos correctamente.');
      Object.keys(this.tierForm.controls).forEach(key => {
        this.tierForm.get(key)?.markAsTouched();
      });
      return;
    }

    const tier = this.selectedTier();
    if (!tier) {
      this.submitError.set('No se ha seleccionado un plan válido.');
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    const { email, password, domain } = this.tierForm.value;

    try {
      // 1. Validar credenciales (usando tu AuthService existente)
      const registeredEmail = localStorage.getItem('registeredEmail');
      const registeredPassword = localStorage.getItem('registeredPassword');

      if (email !== registeredEmail || password !== registeredPassword) {
        this.submitError.set('El correo y/o la contraseña no coinciden con los datos de registro.');
        this.isSubmitting.set(false);
        return;
      }

      // 2. Crear cliente con el tier seleccionado
      await this.createClientWithTier(tier.id);

      // 3. Si hay dominio, agregarlo
      if (domain) {
        await this.addDomainToClient(domain);
        localStorage.setItem('selectedDomain', domain);
      }

      // 4. Guardar plan seleccionado
      localStorage.setItem('selectedPlan', tier.displayName);

      // 5. Redirigir al dashboard
      this.router.navigate(['/platform']);

    } catch (error: any) {
      console.error('Error en el proceso de registro:', error);
      this.submitError.set(error.message || 'Error al procesar la solicitud. Intenta nuevamente.');
      this.isSubmitting.set(false);
    }
  }

  private createClientWithTier(tierId: TierLevel): Promise<void> {
    return new Promise((resolve, reject) => {
      // Llamar al endpoint POST /clients/addClient/:tier
      this.dashboard.addClient(tierId).subscribe({
        next: () => {
          console.log('Cliente creado con tier:', tierId);
          resolve();
        },
        error: (err) => {
          console.error('Error creando cliente:', err);
          // Si ya existe el cliente, continuar de todas formas
          if (err.status === 409 || err.error?.error?.includes('already exists')) {
            resolve();
          } else {
            reject(new Error('Error al crear el cliente. Verifica tus credenciales.'));
          }
        }
      });
    });
  }

  private addDomainToClient(domain: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.dashboard.addWeb(domain).subscribe({
        next: () => {
          console.log('Dominio agregado:', domain);
          
          // Guardar en localStorage como fallback
          const localDomains = localStorage.getItem('domains');
          let domainsArr = [];
          if (localDomains) {
            try {
              domainsArr = JSON.parse(localDomains);
            } catch {}
          }
          domainsArr.unshift({ 
            name: domain, 
            createdAt: new Date().toISOString(), 
            commentsCount: 0 
          });
          localStorage.setItem('domains', JSON.stringify(domainsArr));
          
          resolve();
        },
        error: (err) => {
          console.error('Error agregando dominio:', err);
          
          // Guardar en localStorage si falla el backend
          const localDomains = localStorage.getItem('domains');
          let domainsArr = [];
          if (localDomains) {
            try {
              domainsArr = JSON.parse(localDomains);
            } catch {}
          }
          domainsArr.unshift({ 
            name: domain, 
            createdAt: new Date().toISOString(), 
            commentsCount: 0 
          });
          localStorage.setItem('domains', JSON.stringify(domainsArr));
          
          // No rechazamos, continuamos
          resolve();
        }
      });
    });
  }

  // Helpers para el template
  get emailControl() {
    return this.tierForm.get('email');
  }

  get passwordControl() {
    return this.tierForm.get('password');
  }

  get domainControl() {
    return this.tierForm.get('domain');
  }
}