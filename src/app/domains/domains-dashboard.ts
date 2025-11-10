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
        this.submitError.set(err.error?.error || 'Error al añadir el dominio.');
      }
    });
  }

  onViewInboxSelectedDomain(): void {
    const domain = this.getSelectedDomainItem();
    if (domain) {
      this.onViewInbox(domain);
    }
  }

  getSelectedDomainItem(): DomainItem | null {
    const name = this.selectedDomain();
    return this.domains().find(d => d.name === name) || null;
  }

  onViewInbox(domain: DomainItem): void {
    this.router.navigate(['/dashboard/comments'], { 
      queryParams: { domain: domain.name } 
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