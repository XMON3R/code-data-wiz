
import { DomainSpecificModel } from "../../data-model-api/domain-specific-model-api";

/**
 * {@link https://learn.microsoft.com/en-us/dotnet/csharp/}
 */

/**
 * Represents a single property within a C# class.
 */
export interface CsharpProperty {
    name: string;
    type: string; // e.g., "string", "int", "MyCustomClass"
    accessModifier?: string; // e.g., "public", "private", "protected", "internal"
    isStatic?: boolean;
    isReadonly?: boolean; // For 'readonly' fields
    // Add other property-level details like default values, attributes
}

/**
 * Represents a single method within a C# class.
 */
export interface CsharpMethod {
    name: string;
    returnType: string;
    parameters: CsharpParameter[];
    accessModifier?: string;
    isStatic?: boolean;
    isAsync?: boolean;
    // Add other method-level details like virtual, override, abstract, attributes
}

/**
 * Represents a single parameter of a C# method.
 */
export interface CsharpParameter {
    name: string;
    type: string;
    // Add other parameter-level details like 'ref', 'out', 'in', default values
}

/**
 * Represents a single C# class, interface, struct, or enum.
 */
export interface CsharpClass {
    name: string;
    type: "class" | "interface" | "struct" | "enum"; // Type of the C# construct
    accessModifier?: string;
    baseClass?: string; // For inheritance
    implementedInterfaces?: string[];
    properties: CsharpProperty[];
    methods: CsharpMethod[];
    // Add other class-level details like generics, attributes, nested types
}

/**
 * The domain-specific model for C# code.
 * This represents the overall structure of a C# file or project.
 */
export interface CsharpModel extends DomainSpecificModel {
    namespace?: string; // The namespace of the C# file
    usings?: string[]; // List of 'using' statements
    classes: CsharpClass[]; // Main collection of C# constructs
    // Add other file-level details like comments, attributes
}