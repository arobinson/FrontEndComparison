import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrameworkHeader } from './shared/framework-header/framework-header';

@Component({
  selector: 'aff-root',
  imports: [RouterOutlet, FrameworkHeader],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'AngularFoodFacts';
}
