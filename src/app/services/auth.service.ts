import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, BehaviorSubject } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiurl = environment.apiUrl;
  private tokenKey = 'authToken';
  private tokenTimestampKey = 'tokenTimestamp';
  private readonly TOKEN_EXPIRATION_TIME = 30 * 60 * 1000
  
  isAuthenticated$ = new BehaviorSubject<boolean>(this.isTokenValid());

  constructor(private http: HttpClient){
    this.checkTokenExpiration();
    setInterval(() => this.checkTokenExpiration(), 5000);
  }

  register(userData: any): Observable<any>{
    return this.http.post(`${this.apiurl}/users/register`, userData, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
  }

  login(credentials:any): Observable<any>{
    return this.http.post(`${this.apiurl}/users/login`, credentials, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
      .pipe(
        tap((response: any) => {
          const token = response.token || 'token_' + Date.now();
          this.setToken(token);
          this.isAuthenticated$.next(true);
        })
      );
  }


  createClient(tier: string = '1'): Observable<any> {
    return this.http.post(`${this.apiurl}/clients/addClient/${tier}`, {}, { 
      headers: { 'Content-Type': 'application/json' }, 
      withCredentials: true 
    });
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.tokenTimestampKey, Date.now().toString());
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  private isTokenValid(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    const timestamp = localStorage.getItem(this.tokenTimestampKey);

    if (!token || !timestamp) {
      return false;
    }

    const tokenAge = Date.now() - parseInt(timestamp, 10);
    return tokenAge < this.TOKEN_EXPIRATION_TIME;
  }
  private checkTokenExpiration(): void {
    if (this.getToken() && !this.isTokenValid()) {
      this.logout();
    }
  }

  isAuthenticated(): boolean {
    return this.isTokenValid();
  }
  getTimeRemaining(): number {
    const timestamp = localStorage.getItem(this.tokenTimestampKey);
    if (!timestamp) return 0;

    const tokenAge = Date.now() - parseInt(timestamp, 10);
    const remaining = Math.max(0, this.TOKEN_EXPIRATION_TIME - tokenAge);
    return Math.ceil(remaining / 1000);
  }
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenTimestampKey);
    this.isAuthenticated$.next(false);
  }
}