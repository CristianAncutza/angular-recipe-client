import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { filter } from 'rxjs';
import { Header } from "./features/recipes/header/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('RecipeClient');
  private router = inject(Router);
  showHeader = true;
  
  constructor() {
    
    this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
        this.showHeader = !event.url.includes('/login') && !event.url.includes('/register');
    });
  }
  
}
