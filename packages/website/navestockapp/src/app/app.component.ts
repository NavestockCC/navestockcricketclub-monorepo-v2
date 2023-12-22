import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SponsorsComponent } from '@navestockcricketclub-monorepo-v2/sponsors';

@Component({
  standalone: true,
  imports: [RouterModule, SponsorsComponent],
  selector: 'ncc-app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {}
