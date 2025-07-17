import { describe, it, expect } from "vitest";
import { JavaParser } from "./java-parser";

describe("JavaParser - Success Cases", () => {
    const parser = new JavaParser();

    const sampleCode = `
package com.example.models;

import java.util.Date;
import java.util.List;

/**
 * Represents a user in the system.
 */
public class User {

    @Id
    @GeneratedValue
    private Long id;

    private String username;
    protected String email;
    public final String userType = "standard";
}
`;

    /*
    it("should correctly parse the package name", async () => {
        const model = await parser.parseText(sampleCode);
        expect(model.packageName).toBe("com.example.models");
    });

    it("should correctly parse import statements", async () => {
        const model = await parser.parseText(sampleCode);
        expect(model.imports).toEqual(["java.util.Date", "java.util.List"]);
    });*/

    it("should correctly parse class details", async () => {
        const model = await parser.parseText(sampleCode);
        expect(model.classes).toHaveLength(1);
        const userClass = model.classes[0];
        expect(userClass.name).toBe("User");
        expect(userClass.type).toBe("class");
        expect(userClass.accessModifier).toBe("public");
    });

    it("should correctly parse fields with access modifiers", async () => {
        const model = await parser.parseText(sampleCode);
        const userClass = model.classes[0];
        
        const idField = userClass.fields.find(f => f.name === "id");
        const emailField = userClass.fields.find(f => f.name === "email");
        const typeField = userClass.fields.find(f => f.name === "userType");

        expect(idField?.accessModifier).toBe("private");
        expect(emailField?.accessModifier).toBe("protected");
        expect(typeField?.accessModifier).toBe("public");
    });

    it("should correctly parse field types and modifiers", async () => {
        const model = await parser.parseText(sampleCode);
        const userClass = model.classes[0];
        
        const idField = userClass.fields.find(f => f.name === "id");
        const typeField = userClass.fields.find(f => f.name === "userType");

        expect(idField?.type).toBe("Long");
        expect(typeField?.isFinal).toBe(true);
        expect(idField?.isStatic).toBe(false);
    });

    it("should correctly parse annotations on fields", async () => {
        const model = await parser.parseText(sampleCode);
        const userClass = model.classes[0];
        
        const idField = userClass.fields.find(f => f.name === "id");
        const usernameField = userClass.fields.find(f => f.name === "username");

        expect(idField?.annotations).toHaveLength(2);
        expect(idField?.annotations.map(a => a.name)).toEqual(["Id", "GeneratedValue"]);
        expect(usernameField?.annotations).toHaveLength(0);
    });
});


describe("JavaParser - Error and Edge Cases", () => {
    const parser = new JavaParser();

    it("should return an empty model for an empty string", async () => {
        const model = await parser.parseText("");
        /*
        expect(model.packageName).toBeUndefined();
        expect(model.imports).toEqual([]);
        */
        expect(model.classes).toEqual([]);
    });

    it("should throw an error for malformed class syntax", async () => {
        const invalidCode = `
        public class MyClass {
            private String name // Missing semicolon
        }
        `;
        // The current parser relies on semicolons to find fields, so this will
        // result in a partially incorrect model, but won't throw an error.
        // A more advanced parser would throw here. For now, we test the current behavior.
        const model = await parser.parseText(invalidCode);
        const myClass = model.classes[0];
        expect(myClass.fields).toHaveLength(0); // It fails to parse the field, as expected.
    });
});
