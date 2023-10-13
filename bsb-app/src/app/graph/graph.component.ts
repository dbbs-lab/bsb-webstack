import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SvgIconComponent } from 'angular-svg-icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { ExplorerComponent } from '../explorer/explorer.component';
import { Configuration, ProjectService } from '../project.service';
import { LetDirective } from '@ngrx/component';
import { ExplorerService } from '../explorer/explorer.service';
import { Subject, withLatestFrom } from 'rxjs';

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
export class GraphComponent implements OnDestroy {
  project$ = this.project.activeProject$;
  config$ = this.project.activeConfig$;
  private modifyConfig = new Subject<(config: Configuration) => void>();
  private readonly modSub = this.modifyConfig
    .pipe(withLatestFrom(this.config$))
    .subscribe(([mod, config]) => {
      mod(config);
      this.updateGraph$.next(true);
    });
  updateGraph$ = new Subject<boolean>();

  constructor(
    private readonly project: ProjectService,
    private readonly explorer: ExplorerService,
    private readonly changeRef: ChangeDetectorRef
  ) {}

  addComponent(node: any) {
    this.modifyConfig.next((config) => config.createChild(node));
    this.explorer.selectNode(node);
  }

  selectComponent(node: any) {}

  ngOnDestroy() {
    this.modSub.unsubscribe();
  }
}
