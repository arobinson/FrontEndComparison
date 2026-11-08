import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrameworkHeader } from './layout/framework-header/framework-header';

@Component({
  selector: 'aff-root',
  imports: [RouterOutlet, FrameworkHeader],
  templateUrl: './app.html',
})
export class App {}
