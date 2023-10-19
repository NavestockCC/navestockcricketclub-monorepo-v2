import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {path:'', pathMatch:'full', redirectTo: 'scoreboard'},
    {path: 'scoreboard', loadComponent: () => import('../app/scoreboard/scoreboard.component').then(m=> m.ScoreboardComponent),}
];
