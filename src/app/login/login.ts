import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

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
  errorMessage = signal('');

  constructor(private authService: AuthService) {}

  onLogin(): void {
    this.errorMessage.set('');
    if (this.email && this.password) {
      const success = this.authService.login({
        email: this.email,
        password: this.password
      });
      if (!success) {
        this.errorMessage.set('Email o contraseña incorrectos');
      }
    } else {
      this.errorMessage.set('Por favor completa todos los campos');
    }
  }
}
