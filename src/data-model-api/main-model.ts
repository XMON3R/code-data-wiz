//DODAT KOMENTÁŘE!
export interface UniversalModel {

  entities: Entity[];

}

export interface Entity {
  label: string;

  //name: string // TODO: MÍSTO LABELU

  //humanLabel: string; // TODO

  //humanDescription: string; // TODO

  properties: Property[];
}

export interface Property {
  
  //name: string 

  //humanLabel: string; // TODO

  //humanDescription: string; // TODO

  label: string;
  type: Type;

  //visibility
}



//NIC Z TOHO NENÍ POTŘEBA, PŘES PLUGINY

export interface Type {}

export interface PrimitiveType extends Type {}

export interface ComplexType extends Type {}

export interface GenericType extends Type {}

export interface ContainerType extends GenericType {}
