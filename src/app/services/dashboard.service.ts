import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RolesResponse {
  clientRole: boolean;
  modRole: boolean;
}

interface WebResponse {
  idWeb: number;
  domain: string;
  mode: string;
  status: string;
}

interface MessageResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://talkhubback.onrender.com/dashboard';

  getRoles(): Observable<RolesResponse> {
    return this.http.get<RolesResponse>(`${this.apiUrl}/roles`, { 
      withCredentials: true 
    });
  }

  addWeb(domain: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      `${this.apiUrl}/addWeb/${domain}`, 
      {}, 
      { withCredentials: true }
    );
  }

  getClientWebs(): Observable<WebResponse[]> {
    return this.http.get<WebResponse[]>(`${this.apiUrl}/client`, { 
      withCredentials: true 
    });
  }

  getWebConfig(idWeb: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/config/${idWeb}`, {
      withCredentials: true
    });
  }
}