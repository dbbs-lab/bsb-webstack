import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../project.service';
import { MatSelectModule } from '@angular/material/select';
import { LetDirective } from '@ngrx/component';
import { ExplorerService } from './explorer.service';

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [CommonModule, MatSelectModule, LetDirective],
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements AfterViewInit {
  @Input() project!: Project;
  node$ = this.explorer.selectedNode$;
  @ViewChild('ui', { static: true, read: ViewContainerRef })
  ui!: ViewContainerRef;

  constructor(private readonly explorer: ExplorerService) {}

  ngAfterViewInit() {
    this.node$.subscribe((node) => {
      console.log('SELECTED NODE?', node, this.ui);
    });
  }
}
