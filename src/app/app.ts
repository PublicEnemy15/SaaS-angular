import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { Footer } from './footer/footer';
import { Cards } from "./cards/cards";
import { Hero } from "./hero/hero";
import { About } from "./about/about";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Hero, About, Cards, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('SaaS-angular');
}
