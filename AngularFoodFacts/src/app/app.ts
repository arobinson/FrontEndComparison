import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrameworkHeader } from './shared/framework-header/framework-header';

@Component({
  selector: 'aff-root',
  imports: [RouterOutlet, FrameworkHeader],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App {
  protected title = 'AngularFoodFacts';
}
