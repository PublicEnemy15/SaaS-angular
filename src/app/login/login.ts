
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  email = '';
  password = '';
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (!this.email.trim() || !this.password.trim()) {
      this.message = 'Por favor completa email y contraseña';
      return;
    }

    const data = { mail: this.email, pwd: this.password };
    console.log('Datos enviados al backend:', data);
    this.auth.login(data).subscribe({
      next: (res) => {
        console.log('Login exitoso: ', res);
        this.message = 'Inicio de sesión exitoso';
        this.router.navigate(['/platform']);
      },
      error: (err) => {
        console.error('Error al loguearse: ', err);
        
        if (err.status === 404) {
          this.message = 'Error: El servidor no responde. Por favor intenta más tarde.';
        } else if (err.status === 0 || !err.ok) {
          this.message = 'Error de conexión. Verifica tu conexión a internet.';
        } else if (err.status === 401) {
          this.message = 'Error: Credenciales inválidas';
        } else {
          this.message = err.error?.error || 'Error desconocido al loguearse';
        }
      },
    });
  }
}
