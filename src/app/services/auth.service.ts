import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiurl = environment.apiUrl;

  constructor(private http: HttpClient){}

  register(userData: any): Observable<any>{
    return this.http.post(`${this.apiurl}/users/register`, userData, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
  }

  login(credentials:any): Observable<any>{
    return this.http.post(`${this.apiurl}/users/login`, credentials, { headers: { 'Content-Type': 'application/json' }, withCredentials: true });
  }
}