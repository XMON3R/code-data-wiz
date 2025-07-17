import { describe, it, expect } from "vitest";
import { JavaWriter } from "./java-writer";
import { JavaModel, JavaClassType } from "./java-model";

describe("JavaWriter", () => {
    const writer = new JavaWriter();

    it("should correctly generate a full Java class from a model", async () => {
        const model: JavaModel = {
            classes: [
                {
                    name: "GeneratedUser",
                    type: JavaClassType.Class,
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
        expect(result).toContain("public class GeneratedUser {");
        expect(result).toContain("@Id");
        expect(result).toContain("private long userId;");
        expect(result).toContain("private String username;");
        expect(result).toContain("public static final String USER_ROLE = null;");
        expect(result).toContain("}");
    });

    it("should return an empty string for an empty model", async () => {
        const model: JavaModel = { classes: [] };
        const result = await writer.writeText(model);
        expect(result.trim()).toBe("");
    });

    it("should handle a class with no fields", async () => {
        const model: JavaModel = {
            classes: [{
                name: "EmptyClass",
                type: JavaClassType.Class,
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
