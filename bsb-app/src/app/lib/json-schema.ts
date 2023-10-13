export interface JsonSchemaObject {
  type: 'object';
  properties: { [k: string]: JsonSchemaNode };
  additionalProperties: JsonSchemaNode;
}

export interface JsonSchemaString {
  type: 'string';
}

export interface JsonSchemaAttributes {
  title?: string;
  description?: string;
  $defs: { [k: string]: JsonSchemaNode };
}

export type JsonSchemaNode = JsonSchemaObject | JsonSchemaString;

export type JsonSchema = JsonSchemaAttributes & JsonSchemaObject;
