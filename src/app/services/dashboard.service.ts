import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RolesResponse {
  clientRole: boolean;
  modRole: boolean;
}

interface WebResponse {
  idWeb: string;
  domain: string;
  mode: string;
  status: number;
}

interface MessageResponse {
  message: string;
}

interface ClientDataResponse {
  idClient: number;
  idUser: number;
  idTier: number;
  status: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://talkhubback.onrender.com';

  getRoles(): Observable<RolesResponse> {
    return this.http.get<RolesResponse>(`${this.baseUrl}/dashboard/roles`, { 
      withCredentials: true 
    });
  }

  getClientData(): Observable<ClientDataResponse> {
    return this.http.get<ClientDataResponse>(`${this.baseUrl}/clients/data`, { 
      withCredentials: true 
    });
  }

  addWeb(domain: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      `${this.baseUrl}/dashboard/addWeb/${domain}`, 
      {}, 
      { withCredentials: true }
    );
  }

  getClientWebs(): Observable<WebResponse[]> {
    return this.http.get<WebResponse[]>(`${this.baseUrl}/dashboard/client`, { 
      withCredentials: true 
    });
  }

  getWebConfig(idWeb: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/config/${idWeb}`, {
      withCredentials: true
    });
  }

  // Obtener comentarios del inbox para un web específico
  getInboxComments(idWeb: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/comments/inbox/${idWeb}`, {
      withCredentials: true
    });
  }
}