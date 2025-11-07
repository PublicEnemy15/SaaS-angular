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
  email ='';
  password ='';
  message = '';

  constructor(private  auth: AuthService){}

  login(){
    const data = {mail: this.email, pwd: this.password};
    this.auth.login(data).subscribe({
      next:(res)=>{
        console.log('Login exitoso: ',res);
        localStorage.setItem('token: ', res.token);
        this.message = 'Inicio de sesion exitoso'
      },
      error:(err)=> {
        console.error('Error al loguearse: ',err);
        this.message= 'Error: credenciales invalidas'
      }
    })
  }
}
