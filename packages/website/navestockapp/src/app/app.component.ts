import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  standalone: true,
  imports: [RouterModule, MatButtonModule],
  selector: 'ncc-app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {}
