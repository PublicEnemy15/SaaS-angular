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

  register() {
    if (!this.name.trim() || !this.email.trim() || !this.password.trim()) {
      this.message = 'Rellenar todos los campos';
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
      console.warn('La contraseña tiene que tener al menos 8 caracteres');
      this.message = 'La contraseña tiene que tener al menos 8 valores';
      return;
    }

    const data = { name: this.name, mail: this.email, pwd: this.password };
    console.log('Datos enviados al backend:', data);
    this.auth.register(data).subscribe({
      next: (res) => {
        console.log('Registro exitoso:', res);
        this.zone.run(() => {
          this.message = 'Usuario registrado correctamente';
        });
        
        // Crear cliente automáticamente tras el registro
        this.auth.createClient('1').subscribe({
          next: (clientRes) => {
            console.log('Cliente creado automáticamente:', clientRes);
            setTimeout(() => {
              this.zone.run(() => {
                this.router.navigate(['/platform']);
              });
            }, 500);
          },
          error: (clientErr) => {
            console.error('Error creando cliente:', clientErr);
            // Aún así navegamos a la plataforma, aunque falle la creación del cliente
            setTimeout(() => {
              this.zone.run(() => {
                this.router.navigate(['/platform']);
              });
            }, 500);
          }
        });
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.message = 'Error al registrar ';
      }
    });
  }
}
