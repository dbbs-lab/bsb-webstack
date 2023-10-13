import { Injectable } from '@angular/core';
import { map, Observable, Subject, switchMap } from 'rxjs';
import { Node } from '@swimlane/ngx-graph';
import { ProjectService } from '../project.service';

@Injectable({
  providedIn: 'root',
})
export class ExplorerService {
  _node = new Subject<Node>();
  selectedNode$ = this._node.asObservable();

  constructor(private readonly project: ProjectService) {}

  selectNode(node: Node) {
    this._node.next(node);
  }
}
