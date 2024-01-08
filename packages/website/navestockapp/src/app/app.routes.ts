import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {path:'', pathMatch:'full', redirectTo: 'home'},
    {path: 'home', loadComponent: () => import('../app/scoreboard/scoreboard.component').then(m=> m.ScoreboardComponent),}
];
