import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { LetDirective } from '@ngrx/component';
import { ExplorerService } from './explorer.service';
import { Project } from '../lib/project';
import { FormGroup } from '@angular/forms';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [CommonModule, MatSelectModule, LetDirective],
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements AfterViewInit {
  node$ = this.explorer.selectedNode$;
  @ViewChild('ui', { static: true, read: ViewContainerRef })
  ui!: ViewContainerRef;
  group: FormGroup = new FormGroup<any>({});

  constructor(
    private readonly explorer: ExplorerService,
    private readonly project: ProjectService
  ) {}

  ngAfterViewInit() {
    this.node$.subscribe((node) => {
      console.log('SELECTED NODE?', node, this.ui);
      this.clearGroup();
      const ref = node.meta.ref;
      if (ref) {
        this.setSchemaUI(ref);
      }
    });
  }

  private clearGroup() {
    for (let key of Object.keys(this.group.controls)) {
      this.group.removeControl(key, { emitEvent: false });
    }
  }

  private setSchemaUI(ref: string) {
    this.project.getSchemaRef(ref).subscribe((schema: any) => {
      for (const [key, descr] of Object.entries(schema)) {
      }
    });
  }
}
