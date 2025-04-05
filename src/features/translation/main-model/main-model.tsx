import { CommonModel } from "../parsers/common-model";

export interface MainModel extends CommonModel {
  entities: Entity[];
}

export interface Entity {
  label: string;
  properties: Property[];
}

export interface Property {
  label: string;
  type: Type;
}

export interface Type {}

export interface PrimitiveType extends Type {}

export interface ComplexType extends Type {}

export interface GenericType extends Type {}

export interface ContainerType extends GenericType {}
