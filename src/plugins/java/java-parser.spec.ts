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

    it("should correctly parse the package name", async () => {
        const model = await parser.parseText(sampleCode);
        expect(model.packageName).toBe("com.example.models");
    });

    it("should correctly parse import statements", async () => {
        const model = await parser.parseText(sampleCode);
        expect(model.imports).toEqual(["java.util.Date", "java.util.List"]);
    });

    it("should correctly parse class details", async () => {
        const model = await parser.parseText(sampleCode);
        expect(model.classes).toHaveLength(1);
        const userClass = model.classes[0];
        expect(userClass.name).toBe("User");
        expect(userClass.type).toBe("class");
        expect(userClass.accessModifier).toBe("public");
        expect(userClass.methods).toEqual([]); // Expect empty methods array
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


describe("JavaParser - Methods and Edge Cases", () => {
    const parser = new JavaParser();

    it("should parse a class with a simple method", async () => {
        const code = `
        public class Calculator {
            public int add(int a, int b) {
                return a + b;
            }
        }
        `;
        const model = await parser.parseText(code);
        const calcClass = model.classes[0];

        expect(calcClass.methods).toHaveLength(1);
        const addMethod = calcClass.methods[0];
        expect(addMethod.name).toBe("add");
        expect(addMethod.returnType).toBe("int");
        expect(addMethod.accessModifier).toBe("public");
        expect(addMethod.parameters).toEqual([
            { name: "a", type: "int" },
            { name: "b", type: "int" },
        ]);
    });

    it("should parse a method with modifiers", async () => {
        const code = `
        public class Logger {
            @Deprecated
            public static void log(String message) {
                // ...
            }
        }
        `;
        const model = await parser.parseText(code);
        const loggerClass = model.classes[0];

        expect(loggerClass.methods).toHaveLength(1);
        const logMethod = loggerClass.methods[0];
        expect(logMethod.name).toBe("log");
        expect(logMethod.returnType).toBe("void");
        expect(logMethod.annotations).toHaveLength(1);
        expect(logMethod.annotations[0].name).toBe("Deprecated");
    });

    it("should return an empty model for an empty string", async () => {
        const model = await parser.parseText("");
        expect(model.packageName).toBeUndefined();
        expect(model.imports).toEqual([]);
        expect(model.classes).toEqual([]);
    });

    it("should handle code with no package or imports", async () => {
        const model = await parser.parseText("public class Simple {}");
        expect(model.packageName).toBeUndefined();
        expect(model.imports).toEqual([]);
        expect(model.classes[0].name).toBe("Simple");
    });
});