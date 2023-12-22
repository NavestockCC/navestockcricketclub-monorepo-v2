import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SponsorsComponent } from '@navestockcricketclub-monorepo-v2/sponsors';
import {VerticalCardComponent} from '@ncc/component-verticalCard';

@Component({
  standalone: true,
  imports: [
    RouterModule, 
    SponsorsComponent,
    VerticalCardComponent
  ],
  selector: 'ncc-app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {}
