import { DomainSpecificModel } from "../../data-model-api/domain-specific-model-api";

export interface CSharpType {
    name: string;
    isNullable?: boolean;
}

export interface CSharpProperty {
    name: string;
    type: CSharpType;
    accessModifier: string;
    isReadonly?: boolean;
}

export interface CSharpMethod {
    name: string;
    returnType: CSharpType;
    parameters: CSharpParameter[];
    accessModifier: string;
    isStatic?: boolean;
    isAsync?: boolean;
    isVirtual?: boolean;
    isOverride?: boolean;
}

export interface CSharpParameter {
    name: string;
    type: CSharpType;
}

export interface CSharpClass {
    name: string;
    type: "class" | "interface" | "struct" | "enum";
    accessModifier: string;
    properties: CSharpProperty[];
    methods: CSharpMethod[];
}

export interface CSharpModel extends DomainSpecificModel {
    classes: CSharpClass[];
}

// This is kept for compatibility with the test file.
export interface CSharpDiagram extends DomainSpecificModel {
    classes: CSharpClass[];
}
