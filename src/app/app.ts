import { Component, signal, ChangeDetectionStrategy } from '@angular/core';  
import { RouterOutlet } from '@angular/router';  
import { Header } from "./header/header";  
import { Footer } from './footer/footer';  
  
@Component({  
  selector: 'app-root',  
  standalone: true,  
  imports: [RouterOutlet, Header, Footer],  
  templateUrl: './app.html',  
  styleUrls: ['./app.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush  
})  
export class App {  
  protected readonly title = signal('SaaS-angular');  
}