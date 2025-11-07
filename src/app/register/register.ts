import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  
  name = '';
  email = '';
  password = '';
  message = '';

  constructor(private auth: AuthService) {}

  register() {
    const data = { name: this.name, mail: this.email, pwd: this.password };
    console.log('Datos enviados al backend:', data);
    this.auth.register(data).subscribe({
      next: (res) => {
        console.log('Registro exitoso:', res);
        this.message = 'Usuario registrado correctamente';
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.message = 'Error al registrar ';
      }
    });
  }
}
