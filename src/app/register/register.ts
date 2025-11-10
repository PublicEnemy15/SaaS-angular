import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {

  name = '';
  email = '';
  password = '';
  message = '';

  constructor(private auth: AuthService, private router: Router, private zone: NgZone, private route: ActivatedRoute) { }

  private validacionemail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email)
  }

  ngOnInit() {

    this.route.queryParamMap.subscribe((params: any) => {
      const planId = params.get('plan');
      if (planId) {
        let planTitle = '';
        switch (planId) {
          case '1': planTitle = 'Plan 1: Basico'; break;
          case '2': planTitle = 'Plan 2: Intermedio'; break;
          case '3': planTitle = 'Plan 3: Premium'; break;
        }
        if (planTitle) localStorage.setItem('selectedPlan', planTitle);
      }
    });
  }

  register() {
    if (!this.name.trim() || !this.email.trim() || !this.password.trim()) {
      this.message = 'Rellenar todos los campos'
      console.warn('Formulario incompleto', {
        name: this.name,
        email: this.email,
        password: this.password
      });
      return;
    }

    if (!this.validacionemail(this.email)) {
      this.message = 'Correo inválido';
      console.warn('Correo invalido:', this.email);
      return;
    }

    if (this.password.length < 8) {
      console.warn('La contraseña tiene que tener al menos 8 caracteres')
      this.message = 'La contraseña tiene que tener al menos 8 valores';
      return;
    }

    const data = { name: this.name, mail: this.email, pwd: this.password };
    console.log('Datos enviados al backend:', data);
    this.auth.register(data).subscribe({
      next: (res) => {
        console.log('Registro exitoso:', res);
        // Guarda email y password para validación en tier
        localStorage.setItem('registeredEmail', this.email);
        localStorage.setItem('registeredPassword', this.password);
        this.zone.run(() => {
          this.message = 'Usuario registrado correctamente'
        })
        setTimeout(() => {
          this.zone.run(() => {
            // Navega al tier con el plan seleccionado tras registro
            const plan = localStorage.getItem('selectedPlan') || 'Plan 1: Basico';
            this.router.navigate(['/tier', plan === 'Plan 1: Basico' ? '1' : plan === 'Plan 2: Intermedio' ? '2' : plan === 'Plan 3: Premium' ? '3' : '1']);
          });
        }, 500);
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.message = 'Error al registrar ';
      }
    });
  }
}
