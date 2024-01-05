import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SponsorsComponent } from '@navestockcricketclub-monorepo-v2/sponsors';
import {WelcomeCardComponent} from './home/welcome-card/welcome-card.component';
import {FindUsCardComponent} from './home/FindUs-card/find-us-card.component';
import { RecruitmentComponent } from './home/recruitment/recruitment.component';

@Component({
  standalone: true,
  imports: [
    RouterModule, 
    SponsorsComponent,
    WelcomeCardComponent,
    FindUsCardComponent,
    RecruitmentComponent
  ],
  selector: 'ncc-app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {}
