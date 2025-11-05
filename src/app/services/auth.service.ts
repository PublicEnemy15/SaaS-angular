import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface UserData {
  email: string;
  password?: string;
  companyName?: string;
  planType?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'user_data';

  constructor(private router: Router) {}

  login(user: UserData): boolean {
    const savedUser = this.getUserData();
        if (savedUser) {
      if (savedUser.email === user.email && savedUser.password === user.password) {
        this.router.navigate(['/platform/domains']);
        return true;
      }
      return false;
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.router.navigate(['/platform/domains']);
    return true;
  }

  register(user: UserData): void {
    localStorage.setItem('temp_user_data', JSON.stringify(user));
  }

  completeRegistration(user: UserData): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    localStorage.removeItem('temp_user_data');
    this.router.navigate(['/platform/domains']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  getUserData(): UserData | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  getTempUserData(): UserData | null {
    const data = localStorage.getItem('temp_user_data');
    return data ? JSON.parse(data) : null;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }
}

