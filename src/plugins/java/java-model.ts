import { DomainSpecificModel } from "../../data-model-api/domain-specific-model-api";

/**
 * Represents a Java annotation, e.g., `@Override`.
 */
export interface JavaAnnotation {
    /** The name of the annotation. */
    name: string;
}

/**
 * Represents a single field (member variable) within a Java class.
 */
export interface JavaField {
    /** The name of the field. */
    name: string;
    /** The type of the field (e.g., "String", "int", "List<String>"). */
    type: string;
    /** The access modifier of the field (e.g., "public", "private", "protected", "default"). */
    accessModifier: 'public' | 'private' | 'protected' | 'default';
    /** Indicates if the field is static. */
    isStatic?: boolean;
    /** Indicates if the field is final. */
    isFinal?: boolean;
    /** An array of annotations applied to the field. */
    annotations: JavaAnnotation[];
}

/**
 * Represents a single method within a Java class.
 */
export interface JavaMethod {
    /** The name of the method. */
    name: string;
    /** The return type of the method. */
    returnType: string;
    /** The access modifier of the method. */
    accessModifier: 'public' | 'private' | 'protected' | 'default';
    /** An array of parameters for the method. */
    parameters: { 
        /** The name of the parameter. */
        name: string, 
        /** The type of the parameter. */
        type: string 
    }[];
    /** An array of annotations applied to the method. */
    annotations: JavaAnnotation[];
}

/**
 * Enum for Java class types.
 */
export enum JavaClassType {
    /** A standard class. */
    Class = "class",
    /** An interface. */
    Interface = "interface",
    /** An enumeration. */
    Enum = "enum",
}

/**
 * Represents a single Java class, interface, or enum.
 */
export interface JavaClass {
    /** The name of the class. */
    name:string;
    /** The type of the Java construct (class, interface, enum). */
    type: JavaClassType;
    /** The access modifier of the class. */
    accessModifier: 'public' | 'private' | 'protected' | 'default';
    /** An array of fields belonging to the class. */
    fields: JavaField[];
    /** An array of methods belonging to the class. */
    methods: JavaMethod[];
    // Future enhancements: extends, implements
}

/**
 * The domain-specific model for Java code.
 * Represents the structure of a single .java file.
 */
export interface JavaModel extends DomainSpecificModel {
    //packageName?: string; // Optional package name for the Java file.
    //imports: string[]; // Array of import statements.
    /** An array of Java classes defined in the model. */
    classes: JavaClass[];
}
