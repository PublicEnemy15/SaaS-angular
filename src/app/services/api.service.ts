import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

// Interfaces que coinciden con tu API backend
export interface DomainItem {
  name: string;
  createdAt?: string;
  commentsCount?: number;
  idWeb?: number;
  mode?: string;
  status?: string;
}

export interface WebResponse {
  idWeb: number;
  domain: string;
  mode: string;
  status: string;
}

export interface RolesResponse {
  clientRole: boolean;
  modRole: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiurl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Métodos que NO existen en tu backend - puedes eliminarlos si quieres
  addDomain(domain: DomainItem): Observable<any> {
    return this.http.post(`${this.apiurl}/domains`, domain, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  }

  getDomains(): Observable<DomainItem[]> {
    return this.http.get<DomainItem[]>(`${this.apiurl}/domains`, {
      withCredentials: true
    });
  }
}