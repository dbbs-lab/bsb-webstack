import { Injectable } from '@angular/core';
import { KernelService } from './kernel.service';
import { BehaviorSubject, forkJoin, map, Observable, Subject, tap } from 'rxjs';
import { Edge, Node } from '@swimlane/ngx-graph';
import { JsonSchema, JsonSchemaNode } from './lib/json-schema';

export interface ProjectOptions {
  config?: Record<string, any>;
}

export type ConfigurationInput = Record<string, any>;

export class Configuration {
  private readonly _schema!: BehaviorSubject<JsonSchema>;
  public readonly schema$!: Observable<JsonSchema>;
  public nodes!: Node[];
  public links!: Edge[];

  private constructor(schema: JsonSchema, input: ConfigurationInput) {
    this._schema = new BehaviorSubject<JsonSchema>(schema);
    this.schema$ = this._schema.asObservable();
    this.resetConfig(input);
  }

  static create(
    kernel: KernelService,
    input?: ConfigurationInput
  ): Observable<Configuration> {
    if (input)
      return kernel
        .getSchema(input)
        .pipe(map((schema) => new this(schema, input)));
    else return this.createDefault(kernel);
  }

  static createDefault(kernel: KernelService): Observable<Configuration> {
    return forkJoin([kernel.getDefaultConfig(), kernel.getSchema()]).pipe(
      map(([config, schema]) => new this(schema, config))
    );
  }

  resetConfig(input: ConfigurationInput) {
    this.nodes = [];
    this.links = [];
    this.makeNodesAndLinks(
      input,
      this._schema.value,
      [],
      this.nodes,
      this.links
    );
  }

  makeNodesAndLinks(
    data: ConfigurationInput,
    schema: JsonSchemaNode,
    path: (string | number)[],
    nodes: Node[],
    links: Edge[],
    parent?: Node
  ) {
    console.log('Checking schema', schema, path, data);
    if (data === undefined) {
      return;
    }
    let ref: string | undefined;
    if (schema && '$ref' in schema) {
      ref = (schema.$ref as string).split('/').pop()!;
      schema = this._schema.value.$defs[ref];
    }
    let node: Node | undefined;
    if (path.length) {
      node = {
        id: path.join('.'),
        label: String(path[path.length - 1]),
        meta: {
          path,
          ref,
        },
        data,
      };
      nodes.push(node);
      if (parent) {
        links.push({ source: parent.id, target: node.id });
      }
    }
    if (schema.type == 'object') {
      for (const [attr, value] of Object.entries(schema['properties'])) {
        this.makeNodesAndLinks(
          data[attr],
          value,
          [...path, attr],
          nodes,
          links,
          node
        );
      }
      if ('additionalProperties' in schema) {
        for (const [key, value] of Object.entries(data)) {
          this.makeNodesAndLinks(
            value,
            schema.additionalProperties,
            [...path, key],
            nodes,
            links,
            node
          );
        }
      }
    }
  }
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

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  activeProject$ = new BehaviorSubject(new Project(this.kernel, {}));
  constructor(private readonly kernel: KernelService) {
    this.activeProject$.value
      .resetConfig()
      .subscribe((config) => console.log('Created config', config));
  }

  create(options?: ProjectOptions): Project {
    return new Project(this.kernel, options ?? {});
  }
}
