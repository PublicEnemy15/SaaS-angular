import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiurl = environment.apiUrl;
  // private isAutenticated = signal<boolean>(false);
  // private userData = signal<any>(null);

  // constructor(private http: HttpClient) {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     this.userData.set(JSON.parse(storedUser));
  //     this.isAutenticated.set(true);
  //   }
  // }

  // register(userData: { name: string; mail: string; pwd: string; }): Observable<any> {
  //   const payload = {
  //     name: userData.name,
  //     mail: userData.mail,
  //     pwd: userData.pwd
  //   };

  //   return this.http.post(`${this.apiurl}/users/register`, payload, {
  //     headers: { 'Content-Type': 'application/json' },
  //     withCredentials: true
  //   }).pipe(
  //     tap((res)=>{
  //       this.userData.set(res);
  //       this.isAutenticated.set(true);
  //       localStorage.setItem('user',JSON.stringify(res));
  //     })
  //   );
  // }

  constructor(private http: HttpClient){}

  register(userData: any): Observable<any>{
    return this.http.post(`${this.apiurl}/users/register`, userData, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
  }

  login(credentials:any): Observable<any>{
    return this.http.post(`${this.apiurl}/users/login`, credentials, { headers: { 'Content-Type': 'application/json' }, withCredentials: true });
  }
}