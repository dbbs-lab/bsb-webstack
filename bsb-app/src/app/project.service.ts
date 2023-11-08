import { Injectable } from '@angular/core';
import { KernelService } from './kernel.service';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { Project, ProjectOptions } from './lib/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  activeProject$ = new BehaviorSubject(new Project(this.kernel, {}));
  activeConfig$ = this.activeProject$.pipe(
    switchMap((project) => project.configuration$)
  );
  activeSchema$ = this.activeConfig$.pipe(
    switchMap((config) => config.schema$)
  );
  constructor(private readonly kernel: KernelService) {
    this.activeProject$.value
      .resetConfig()
      .subscribe((config) => console.log('Created config', config));
  }

  create(options?: ProjectOptions): Project {
    return new Project(this.kernel, options ?? {});
  }

  getSchemaRef(ref: string) {
    return of({});
  }
}
