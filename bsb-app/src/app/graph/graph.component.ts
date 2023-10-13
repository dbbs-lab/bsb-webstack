import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SvgIconComponent } from 'angular-svg-icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { ExplorerComponent } from '../explorer/explorer.component';
import { ProjectService } from '../project.service';
import { LetDirective } from '@ngrx/component';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    SvgIconComponent,
    MatSidenavModule,
    NgxGraphModule,
    ExplorerComponent,
    LetDirective,
  ],

  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent {
  project$ = this.projectSvc.activeProject$;

  constructor(private readonly projectSvc: ProjectService) {}

  addComponent(node: any) {}

  selectComponent(node: any) {}
}
