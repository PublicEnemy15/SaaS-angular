import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { Cards } from "./cards/cards";
import { Hero } from "./hero/hero";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Hero, Cards],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('SaaS-angular');
}
