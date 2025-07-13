import { describe, it, expect } from "vitest";
import { JavaWriter } from "./java-writer";
import { JavaModel } from "./java-model";

describe("JavaWriter", () => {
    const writer = new JavaWriter();

    it("should correctly generate a full Java class from a model", async () => {
        const model: JavaModel = {
            packageName: "com.example.generated",
            imports: ["java.util.List", "java.util.Date"],
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
                        },
                        {
                            name: "username",
                            type: "String",
                            accessModifier: "private",
                            annotations: [],
                        },
                        {
                            name: "USER_ROLE",
                            type: "String",
                            accessModifier: "public",
                            isStatic: true,
                            isFinal: true,
                            annotations: [],
                        }
                    ],
                    methods: [],
                }
            ]
        };

        const result = await writer.writeText(model);

        // Using .includes() for flexibility with whitespace and newlines
        expect(result).toContain("package com.example.generated;");
        expect(result).toContain("import java.util.List;");
        expect(result).toContain("import java.util.Date;");
        expect(result).toContain("public class GeneratedUser {");
        expect(result).toContain("@Id");
        expect(result).toContain("private long userId;");
        expect(result).toContain("private String username;");
        expect(result).toContain("public static final String USER_ROLE;");
        expect(result).toContain("}");
    });

    it("should return an empty string for an empty model", async () => {
        const model: JavaModel = { imports: [], classes: [] };
        const result = await writer.writeText(model);
        expect(result.trim()).toBe("");
    });

    it("should handle a class with no fields", async () => {
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
