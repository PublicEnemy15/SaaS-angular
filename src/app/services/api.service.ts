import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

export interface DomainItem {
  name: string;
  idWeb?: string;
  mode?: string;
  status?: number;
  createdAt: string;
  commentsCount: number;
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

// Tipos para la API de comentarios (coinciden con la respuesta del backend)
export interface CommentRow {
  idComment: number;
  rootId: number | null;
  replyTo: number | null;
  user: string;
  userRef?: string | null;
  content: string;
  created: string;
  replies: number;
}

export interface CommentResponse {
  idComment: number;
  rootId: number | null;
  replyTo: number | null;
  user: string;
  userRef?: string | null;
  content: string;
  created: string;
  replies: number;
  comments: CommentRow[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiurl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Métodos de dominios (existentes en el proyecto)
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

  // --- Nuevos métodos para integrar la API de comentarios ---
  // fullUrl debe incluir el host que espera el backend (p.ej. https://www.youtube.com/...)
  getRootComments(fullUrl: string): Observable<CommentRow[]> {
    const headers = new HttpHeaders({ 'Full-URL': fullUrl });
    return this.http.get<CommentRow[]>(`${this.apiurl}/comments/implement`, { headers, withCredentials: true });
  }

  // Devuelve comentarios raíz con sus replies anidados (structure: CommentResponse[])
  getReplies(fullUrl: string): Observable<CommentResponse[]> {
    const headers = new HttpHeaders({ 'Full-URL': fullUrl });
    return this.http.get<CommentResponse[]>(`${this.apiurl}/comments/implement/replies`, { headers, withCredentials: true });
  }

  // Enviar un comentario (body debe seguir CommentImplement definido en el backend)
  postComment(body: any, fullUrl: string): Observable<any> {
    const headers = new HttpHeaders({ 'Full-URL': fullUrl, 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiurl}/comments/implement`, body, { headers, withCredentials: true });
  }
}