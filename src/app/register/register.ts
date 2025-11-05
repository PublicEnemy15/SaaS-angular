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
export class Register implements OnInit {
  name = '';
  email = '';
  password = '';
  selectedPlan: string | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedPlan = params['plan'] || null;
    });
  }

  onRegister(): void {
    if (this.name && this.email && this.password) {
      this.authService.register({
        email: this.email,
        password: this.password,
        companyName: this.name
      });
      
      if (this.selectedPlan) {
        this.router.navigate(['/tier', this.selectedPlan]);
      } else {
        this.router.navigate(['/']);
      }
    }
  }
}
