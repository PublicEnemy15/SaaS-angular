import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, signal, inject } from '@angular/core';
import { DomainItem } from '../services/api.service';
import { DashboardService } from '../services/dashboard.service';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

const urlOrDomainValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const raw = (control.value ?? '').toString().trim();
  if (!raw) return { required: true };
  const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
  return pattern.test(raw) ? null : { urlFormat: true };
};

interface ClientData {
  idClient: number;
  idUser: number;
  idTier: number;
  status: number;
}

interface PlanInfo {
  name: string;
  type: string;
  maxWebs: number;
}

@Component({
  selector: 'app-domains-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './domains-dashboard.html',
  styleUrls: ['./domains-dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DomainsDashboard {
  private readonly router = inject(Router);
  private readonly dashboard = inject(DashboardService);

  // Signals de estado
  readonly roles = signal<{ clientRole: boolean; modRole: boolean } | null>(null);
  readonly clientData = signal<ClientData | null>(null);
  readonly selectedPlan = signal<string>(localStorage.getItem('selectedPlan') || '');
  readonly selectedDomain = signal<string>(localStorage.getItem('selectedDomain') || '');
  readonly domains = signal<DomainItem[]>([]);
  readonly isAddModalOpen = signal(false);
  readonly isLoading = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly submitSuccess = signal<string | null>(null);

  // Form control
  readonly urlControl = new FormControl<string>('', { 
    nonNullable: true, 
    validators: [Validators.required, urlOrDomainValidator] 
  });

  // Computed para plan actual
  readonly currentPlan = computed((): PlanInfo => {
    const clientData = this.clientData();
    if (!clientData) {
      // Fallback a localStorage
      const localPlan = localStorage.getItem('selectedPlan') || '';
      return this.getPlanInfoFromName(localPlan);
    }

    return this.getPlanInfoFromTier(clientData.idTier);
  });

  // Computed para verificar si puede agregar más webs
  readonly canAddMoreWebs = computed(() => {
    const plan = this.currentPlan();
    const currentWebsCount = this.domains().length;
    return currentWebsCount < plan.maxWebs;
  });

  // Computed
  readonly isDuplicate = computed(() => {
    const raw = (this.urlControl.value || '').trim().toLowerCase();
    if (!raw) return false;
    const normalized = this.normalizeToDomain(raw);
    return this.domains().some(d => d.name.toLowerCase() === normalized);
  });

  constructor() {
    // Effect para limpiar mensajes al cambiar input
    effect(() => {
      void this.urlControl.value;
      this.submitError.set(null);
      this.submitSuccess.set(null);
    });

    this.loadInitialData();
  }

  private getPlanInfoFromTier(idTier: number): PlanInfo {
    switch (idTier) {
      case 1:
        return { name: 'Plan 1: Básico', type: 'Plan Básico', maxWebs: 1 };
      case 2:
        return { name: 'Plan 2: Intermedio', type: 'Plan Intermedio', maxWebs: 5 };
      case 3:
        return { name: 'Plan 3: Premium', type: 'Plan Premium', maxWebs: 999 }; // Ilimitado
      default:
        return { name: 'Sin Plan', type: 'Sin Plan', maxWebs: 0 };
    }
  }

  private getPlanInfoFromName(planName: string): PlanInfo {
    if (planName.includes('Básico') || planName.includes('Plan 1')) {
      return { name: 'Plan 1: Básico', type: 'Plan Básico', maxWebs: 1 };
    } else if (planName.includes('Intermedio') || planName.includes('Plan 2')) {
      return { name: 'Plan 2: Intermedio', type: 'Plan Intermedio', maxWebs: 5 };
    } else if (planName.includes('Premium') || planName.includes('Plan 3')) {
      return { name: 'Plan 3: Premium', type: 'Plan Premium', maxWebs: 999 };
    }
    return { name: 'Sin Plan', type: 'Sin Plan', maxWebs: 0 };
  }

  private loadInitialData(): void {
    this.isLoading.set(true);

    // Cargar roles
    this.dashboard.getRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles);
      },
      error: () => {
        this.roles.set(null);
      }
    });

    // Cargar datos del cliente
    this.dashboard.getClientData().subscribe({
      next: (data) => {
        this.clientData.set(data);
        const planInfo = this.getPlanInfoFromTier(data.idTier);
        this.selectedPlan.set(planInfo.name);
        localStorage.setItem('selectedPlan', planInfo.name);
      },
      error: (err) => {
        console.error('Error cargando datos del cliente:', err);
        // Fallback a localStorage
        this.clientData.set(null);
      }
    });

    // Cargar webs del backend
    this.dashboard.getClientWebs().subscribe({
      next: (webs) => {
        const items: DomainItem[] = webs.map(w => ({
          name: w.domain,
          idWeb: w.idWeb,
          mode: w.mode,
          status: w.status,
          createdAt: '',
          commentsCount: 0
        }));
        
        this.domains.set(items);
        this.isLoading.set(false);

        // Sincronizar con localStorage
        localStorage.setItem('domains', JSON.stringify(items));

        // Restaurar selección si existe
        const selected = this.selectedDomain();
        if (selected && !items.some(d => d.name === selected)) {
          this.selectedDomain.set(items[0]?.name || '');
        }
      },
      error: () => {
        this.isLoading.set(false);
        // Fallback a localStorage
        this.loadFromLocalStorage();
      }
    });
  }

  private loadFromLocalStorage(): void {
    const localDomains = localStorage.getItem('domains');
    if (localDomains) {
      try {
        this.domains.set(JSON.parse(localDomains));
      } catch {
        this.domains.set([]);
      }
    }
  }

  openAddModal(): void {
    if (!this.canAddMoreWebs()) {
      this.submitError.set(`Has alcanzado el límite de dominios para tu plan (${this.currentPlan().maxWebs}). Actualiza tu plan para agregar más.`);
      return;
    }

    this.isAddModalOpen.set(true);
    this.urlControl.setValue('');
    this.submitError.set(null);
    this.submitSuccess.set(null);
  }

  closeAddModal(): void {
    this.isAddModalOpen.set(false);
  }

  addDomain(): void {
    this.urlControl.markAsTouched();
    
    if (this.urlControl.invalid) {
      this.submitError.set('Formato de URL o dominio no válido.');
      return;
    }

    if (!this.canAddMoreWebs()) {
      this.submitError.set(`Has alcanzado el límite de dominios para tu plan (${this.currentPlan().maxWebs}).`);
      return;
    }

    const normalized = this.normalizeToDomain(this.urlControl.value);
    
    if (this.domains().some(d => d.name.toLowerCase() === normalized)) {
      this.submitError.set('Este dominio ya existe en la lista.');
      return;
    }

    this.isLoading.set(true);

    // Llamar al backend
    this.dashboard.addWeb(normalized).subscribe({
      next: () => {
        // Recargar la lista completa desde el backend
        this.dashboard.getClientWebs().subscribe({
          next: (webs) => {
            const items: DomainItem[] = webs.map(w => ({
              name: w.domain,
              idWeb: w.idWeb,
              mode: w.mode,
              status: w.status,
              createdAt: '',
              commentsCount: 0
            }));
            
            this.domains.set(items);
            this.submitSuccess.set('Dominio añadido correctamente.');
            this.urlControl.setValue('');
            this.isAddModalOpen.set(false);
            this.isLoading.set(false);

            // Seleccionar el nuevo dominio
            localStorage.setItem('selectedDomain', normalized);
            this.selectedDomain.set(normalized);
            localStorage.setItem('domains', JSON.stringify(items));
          },
          error: () => {
            this.isLoading.set(false);
            this.submitError.set('Error al recargar dominios.');
          }
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error añadiendo web:', err);
        console.error('Error status:', err.status);
        console.error('Error body:', err.error);
        
        // Extraer el mensaje de error del backend si existe
        let errorMsg = 'Error al añadir el dominio.';
        
        if (err.status === 500) {
          errorMsg = 'Error interno del servidor. Por favor intenta más tarde.';
          console.error('Detalles del error 500:', {
            status: err.status,
            statusText: err.statusText,
            url: err.url,
            errorBody: err.error
          });
          // Intentar recargar de todas formas por si se agregó parcialmente
          setTimeout(() => {
            this.dashboard.getClientWebs().subscribe({
              next: (webs) => {
                const items: DomainItem[] = webs.map(w => ({
                  name: w.domain,
                  idWeb: w.idWeb,
                  mode: w.mode,
                  status: w.status,
                  createdAt: '',
                  commentsCount: 0
                }));
                this.domains.set(items);
                localStorage.setItem('domains', JSON.stringify(items));
              },
              error: () => {
                console.warn('No se pudo recargar dominios');
              }
            });
          }, 1000);
        } else if (err.status === 404) {
          errorMsg = 'Cliente no encontrado. Por favor recarga la página.';
        } else if (err.status === 401) {
          errorMsg = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
        } else if (err.status === 400) {
          errorMsg = 'Solicitud inválida. Verifica el formato del dominio.';
          if (err.error?.error) {
            errorMsg += ` - ${err.error.error}`;
          }
        } else if (err.error?.error) {
          errorMsg = err.error.error;
        } else if (err.message) {
          errorMsg = err.message;
        }
        
        this.submitError.set(errorMsg);
      }
    });
  }

  onViewInbox(domain: DomainItem): void {
    this.router.navigate(['/dashboard/comments'], { 
      queryParams: { domain: domain.name, idWeb: domain.idWeb } 
    });
  }

  onOpenSettings(domain: DomainItem): void {
    if (domain.idWeb) {
      this.router.navigate(['/dashboard/settings'], { 
        queryParams: { idWeb: domain.idWeb } 
      });
    } else {
      console.warn('No idWeb disponible para:', domain.name);
    }
  }

  private normalizeToDomain(input: string): string {
    let value = input.trim().toLowerCase();
    value = value.replace(/^https?:\/\//, '');
    const slashIdx = value.indexOf('/');
    if (slashIdx !== -1) value = value.slice(0, slashIdx);
    return value;
  }
}