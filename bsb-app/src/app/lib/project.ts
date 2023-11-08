import { Observable, Subject, tap } from 'rxjs';
import { KernelService } from '../kernel.service';
import { Configuration, ConfigurationInput } from './configuration';

export interface ProjectOptions {
  config?: Record<string, any>;
}

export class Project {
  private readonly configuration = new Subject<Configuration>();
  public readonly configuration$ = this.configuration.asObservable();

  constructor(
    private readonly kernel: KernelService,
    private readonly options: ProjectOptions
  ) {}

  resetConfig(input?: ConfigurationInput): Observable<Configuration> {
    return Configuration.create(this.kernel, input).pipe(
      tap((config) => {
        this.configuration.next(config);
      })
    );
  }
}
