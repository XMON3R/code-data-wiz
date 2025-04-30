//  These interfaces define the structure of your data model.  They describe
//  the shape of the data that your application manages.

//  The top-level interface representing the entire data model.
export interface UniversalModel {
  /**
   * An array of Entity objects.  Each Entity represents a distinct
   * object or concept in your model (e.g., a class, a table).
   */
  entities: Entity[];
}

//  Represents a single entity within the data model.
export interface Entity {
  /**
   * A user-friendly label for the entity.  This is what's typically
   * displayed in the user interface.
   */
  label: string;

  //  TODO: MÍSTO LABELU - This comment indicates a potential future
  //  change where 'label' might be replaced by 'name'.  'name' would
  //  likely be a more technical, machine-readable identifier.
  // name: string;

  //  TODO - These comments suggest potential future properties for
  //  more detailed, user-facing descriptions.
  // humanLabel: string;
  // humanDescription: string;

  /**
   * An array of Property objects.  Each Property represents an
   * attribute or characteristic of the Entity.
   */
  properties: Property[];
}

//  Represents a property of an entity.
export interface Property {
  //  TODO - Similar to the Entity comments, these indicate potential
  //  future properties for machine-readable names and user-friendly descriptions.
  // name: string;
  // humanLabel: string;
  // humanDescription: string;

  /**
   * A user-friendly label for the property.
   */
  label: string;

  /**
   * The data type of the property.  This determines the kind of
   * data the property can hold.
   */
  type: Type;

  //  visibility -  This comment suggests a potential future property
  //  to control access to the property (e.g., public, private).
  // visibility: string;
}





//  NIC Z TOHO NENÍ POTŘEBA, PŘES PLUGINY - This comment indicates that the
//  following interfaces related to type representation are handled by
//  plugins, not directly by the core application code.  The core
//  application interacts with the 'type' property, but the plugins
//  define the specific types.

//  The base interface for all type representations.
export interface Type {}

//  Represents a primitive data type (e.g., string, number, boolean).
export interface PrimitiveType extends Type {}

//  Represents a complex data type (e.g., a class, a struct).
export interface ComplexType extends Type {}

//  Represents a generic type (e.g., List<T>, Option<T>).
export interface GenericType extends Type {}

//  Represents a container type, a specific kind of generic type.
export interface ContainerType extends GenericType {}
