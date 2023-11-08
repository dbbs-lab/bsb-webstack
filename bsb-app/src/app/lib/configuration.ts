import { BehaviorSubject, forkJoin, map, Observable } from 'rxjs';
import { JsonSchema, JsonSchemaNode } from './json-schema';
import { Edge, Node } from '@swimlane/ngx-graph';
import { KernelService } from '../kernel.service';
import { v4 as uuidv4 } from 'uuid';

export type ConfigurationInput = Record<string, any>;

export class Configuration {
  private readonly _schema!: BehaviorSubject<JsonSchema>;
  public readonly schema$!: Observable<JsonSchema>;
  private _data!: ConfigurationInput;
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

  createChild(parent: Node): Node {
    const id = uuidv4();
    const node: Node = {
      id,
      label: 'New node',
      meta: {
        data: {},
        path: [...parent.meta.path, 'new-node'],
      },
    };
    this.nodes.push(node);
    this.links.push({ source: parent.id, target: node.id });
    return node;
  }

  resetConfig(input: ConfigurationInput) {
    this.nodes = [];
    this.links = [];
    this._data = input;
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
        id: uuidv4(),
        label: String(path[path.length - 1]),
        meta: {
          data,
          path,
          ref,
        },
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
