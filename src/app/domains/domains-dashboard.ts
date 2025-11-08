import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

const urlOrDomainValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const raw = (control.value ?? '').toString().trim();
  if (!raw) return { required: true };
  const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
  return pattern.test(raw) ? null : { urlFormat: true };
};

type DomainItem = {
  id: number;
  name: string; 
  createdAt: string;
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
  private nextId = 1;
  readonly domains = signal<DomainItem[]>([
  
  ]);

  readonly isAddModalOpen = signal(false);
  readonly urlControl = new FormControl<string>('', { nonNullable: true, validators: [Validators.required, urlOrDomainValidator] });
  readonly submitError = signal<string | null>(null);
  readonly submitSuccess = signal<string | null>(null);

  readonly isDuplicate = computed(() => {
    const raw = (this.urlControl.value || '').trim().toLowerCase();
    if (!raw) return false;
    const normalized = this.normalizeToDomain(raw);
    return this.domains().some(d => d.name.toLowerCase() === normalized);
  });

  constructor(private router: Router) {
    effect(() => {
      void this.urlControl.value;
      this.submitError.set(null);
      this.submitSuccess.set(null);
    });
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

    const newItem: DomainItem = {
      id: ++this.nextId,
      name: normalized,
      createdAt: new Date().toISOString()
    };

    this.domains.update(list => [newItem, ...list]);
    this.submitSuccess.set('Dominio añadido correctamente.');
    this.urlControl.setValue('');
    this.isAddModalOpen.set(false);
  }

  onViewInbox(domain: DomainItem): void {
    this.router.navigate(['/dashboard/comments'], { queryParams: { domain: domain.name } });
    console.info('Ver bandeja de:', domain.name);
  }

  onOpenSettings(domain: DomainItem): void {
    console.info('Abrir configuración de:', domain.name);
  }

  private normalizeToDomain(input: string): string {
    let value = input.trim().toLowerCase();
    value = value.replace(/^https?:\/\//, '');
    const slashIdx = value.indexOf('/');
    if (slashIdx !== -1) value = value.slice(0, slashIdx);
    return value;
  }

  
}


