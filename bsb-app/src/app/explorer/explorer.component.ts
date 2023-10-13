import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../project.service';
import { MatSelectModule } from '@angular/material/select';
import { LetDirective } from '@ngrx/component';

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [CommonModule, MatSelectModule, LetDirective],
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent {
  @Input() project!: Project;
  constructor() {}
}
