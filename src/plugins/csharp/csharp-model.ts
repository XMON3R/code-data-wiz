import { DomainSpecificModel } from "../../data-model-api/domain-specific-model-api";

/**
 * Represents a C# type, including its name and nullability.
 */
export interface CSharpType {
    /** The name of the C# type (e.g., "string", "int", "List<string>"). */
    name: string;
    /** Indicates if the type is nullable. */
    isNullable?: boolean;
}

/**
 * Represents a property within a C# class.
 */
export interface CSharpProperty {
    /** The name of the property. */
    name: string;
    /** The type of the property. */
    type: CSharpType;
    /** The access modifier of the property (e.g., "public", "private", "protected"). */
    accessModifier: string;
    /** Indicates if the property is read-only. */
    isReadonly?: boolean;
}

/**
 * Represents a method within a C# class.
 */
export interface CSharpMethod {
    /** The name of the method. */
    name: string;
    /** The return type of the method. */
    returnType: CSharpType;
    /** An array of parameters for the method. */
    parameters: CSharpParameter[];
    /** The access modifier of the method. */
    accessModifier: string;
    /** Indicates if the method is static. */
    isStatic?: boolean;
    /** Indicates if the method is asynchronous. */
    isAsync?: boolean;
    /** Indicates if the method is virtual. */
    isVirtual?: boolean;
    /** Indicates if the method overrides a base class method. */
    isOverride?: boolean;
}

/**
 * Represents a parameter of a C# method.
 */
export interface CSharpParameter {
    /** The name of the parameter. */
    name: string;
    /** The type of the parameter. */
    type: CSharpType;
}

/**
 * Enum defining the types of C# class constructs.
 */
export enum CSharpClassType {
    /** A standard class. */
    Class = "class",
    /** An interface. */
    Interface = "interface",
    /** A value type struct. */
    Struct = "struct",
    /** An enumeration. */
    Enum = "enum",
}

/**
 * Represents a C# class, interface, struct, or enum.
 */
export interface CSharpClass {
    /** The name of the class. */
    name: string;
    /** The type of the class construct. */
    type: CSharpClassType;
    /** The access modifier of the class. */
    accessModifier: string;
    /** An array of properties belonging to the class. */
    properties: CSharpProperty[];
    /** An array of methods belonging to the class. */
    methods: CSharpMethod[];
}

/**
 * The top-level C# domain model, extending `DomainSpecificModel`.
 */
export interface CSharpModel extends DomainSpecificModel {
    /** An array of C# classes defined in the model. */
    classes: CSharpClass[];
}

/**
 * This is kept for compatibility with the test file.
 * Represents a C# diagram, extending `DomainSpecificModel`.
 */
export interface CSharpDiagram extends DomainSpecificModel {
    /** An array of C# classes in the diagram. */
    classes: CSharpClass[];
}
