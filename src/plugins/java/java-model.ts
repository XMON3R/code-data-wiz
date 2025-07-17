import { DomainSpecificModel } from "../../data-model-api/domain-specific-model-api";

/**
 * {@link  https://www.java.com/en/}
 */


/**
 * Represents a Java annotation, e.g., @Override.
 */
export interface JavaAnnotation {
    name: string;
}

/**
 * Represents a single field (member variable) within a Java class.
 */
export interface JavaField {
    name: string;
    type: string;
    accessModifier: 'public' | 'private' | 'protected' | 'default';
    isStatic?: boolean;
    isFinal?: boolean;
    annotations: JavaAnnotation[];
}

/**
 * Represents a single method within a Java class.
 */
export interface JavaMethod {
    name: string;
    returnType: string;
    accessModifier: 'public' | 'private' | 'protected' | 'default';
    parameters: { name: string, type: string }[];
    annotations: JavaAnnotation[];
}

/**
 * Enum for Java class types.
 */
export enum JavaClassType {
    Class = "class",
    Interface = "interface",
    Enum = "enum",
}

/**
 * Represents a single Java class, interface, or enum.
 */
export interface JavaClass {
    name:string;
    type: JavaClassType;
    accessModifier: 'public' | 'private' | 'protected' | 'default';
    fields: JavaField[];
    methods: JavaMethod[];
    // Future enhancements: extends, implements
}

/**
 * The domain-specific model for Java code.
 * Represents the structure of a single .java file.
 */
export interface JavaModel extends DomainSpecificModel {
    //packageName?: string;
    //imports: string[];
    classes: JavaClass[];
}
