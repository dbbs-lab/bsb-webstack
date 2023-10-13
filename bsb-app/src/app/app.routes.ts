import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {path: '', loadComponent: () => import('./graph/graph.component').then(m => m.GraphComponent)}
];
