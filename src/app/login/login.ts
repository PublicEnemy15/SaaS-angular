
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
    const data = { mail: this.email, pwd: this.password };
    console.log('Datos enviados al backend:', data);
    this.auth.login(data).subscribe({
      next: (res: any) => { 
        console.log('Login exitoso: ', res);
        
        if (res && res.token) { 

            localStorage.setItem('auth_token', res.token);
        }
        
        this.message = 'Inicio de sesion exitoso';
        this.router.navigate(['/platform']);
      },
      error: (err) => {
        console.error('Error al loguearse: ', err);
        this.message = 'Error: credenciales invalidas';
      },
    });
  }
}
