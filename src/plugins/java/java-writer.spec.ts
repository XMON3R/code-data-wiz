import { describe, it, expect } from "vitest";
import { JavaWriter } from "./java-writer";
import { JavaModel } from "./java-model";

describe("JavaWriter", () => {
    const writer = new JavaWriter();

    it("should correctly generate a class with fields and methods", async () => {
        const model: JavaModel = {
            packageName: "com.example.generated",
            imports: ["java.util.List"],
            classes: [
                {
                    name: "GeneratedUser",
                    type: "class",
                    accessModifier: "public",
                    fields: [
                        {
                            name: "userId",
                            type: "long",
                            accessModifier: "private",
                            annotations: [{ name: "Id" }],
                        }
                    ],
                    methods: [
                        {
                            name: "getUsername",
                            returnType: "String",
                            accessModifier: "public",
                            parameters: [],
                            annotations: [{ name: "Override" }]
                        }
                    ],
                }
            ]
        };

        const result = await writer.writeText(model);

        // Check for all parts of the generated code
        expect(result).toContain("package com.example.generated;");
        expect(result).toContain("import java.util.List;");
        expect(result).toContain("public class GeneratedUser {");
        expect(result).toContain("@Id");
        expect(result).toContain("private long userId;");
        expect(result).toContain("@Override");
        expect(result).toContain("public String getUsername()");
        expect(result).toContain("}");
    });

    it("should correctly generate a class with only methods", async () => {
        const model: JavaModel = {
            imports: [],
            classes: [{
                name: "Calculator",
                type: "class",
                accessModifier: "public",
                fields: [],
                methods: [{
                    name: "add",
                    returnType: "int",
                    accessModifier: "public",
                    parameters: [{ name: "a", type: "int" }, { name: "b", type: "int" }],
                    annotations: []
                }]
            }]
        };
        const result = await writer.writeText(model);
        expect(result).toContain("public class Calculator {");
        expect(result).toContain("public int add(int a, int b)");
    });

    it("should return an empty string for an empty model", async () => {
        const model: JavaModel = { imports: [], classes: [] };
        const result = await writer.writeText(model);
        expect(result.trim()).toBe("");
    });

    it("should handle a class with no fields or methods", async () => {
        const model: JavaModel = {
            imports: [],
            classes: [{
                name: "EmptyClass",
                type: "class",
                accessModifier: "public",
                fields: [],
                methods: []
            }]
        };
        const result = await writer.writeText(model);
        expect(result).toContain("public class EmptyClass {");
        expect(result).toContain("}");
    });
});