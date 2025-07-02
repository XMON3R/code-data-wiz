import { describe, it, expect } from "vitest";
import { LinkmlParser } from "./linkml-parser";
import { LinkmlModel } from "./linkml-model";

describe("LinkmlParser", () => {
  const parser = new LinkmlParser();

  it("should parse a LinkML string into a LinkmlModel", async () => {
    const input = `
id: http://example.com/my_schema
name: my_schema
description: A simple LinkML schema
classes:
  Person:
    description: A person in the system
    attributes:
      name:
        range: string
      age:
        range: integer
  Organization:
    description: An organization
    attributes:
      orgId:
        range: string
`;
    const expected: LinkmlModel = {
      schema: {
        id: "http://example.com/my_schema",
        name: "my_schema",
        description: "A simple LinkML schema",
        classes: {
          Person: {
            description: "A person in the system",
            attributes: {
              name: {
                range: "string",
              },
              age: {
                range: "integer",
              },
            },
          },
          Organization: {
            description: "An organization",
            attributes: {
              orgId: {
                range: "string",
              },
            },
          },
        },
      },
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
  });

  it("should handle an empty LinkML input string gracefully", async () => {
    const input = "";
    // Expecting an error to be thrown for invalid YAML
    await expect(parser.parseText(input)).rejects.toThrow("Failed to parse LinkML schema.");
  });

  it("should throw an error for invalid YAML syntax", async () => {
    const input = `
id: http://example.com/invalid_schema
  name: my_schema # Incorrect indentation
classes:
  Person:
    description: A person
`;
    await expect(parser.parseText(input)).rejects.toThrow("Failed to parse LinkML schema.");
  });

  it("should throw an error for non-object root in YAML", async () => {
    const input = `"just a string"`;
    await expect(parser.parseText(input)).rejects.toThrow("Failed to parse LinkML schema.");
  });

  it("should parse a LinkML string with no classes", async () => {
    const input = `
id: http://example.com/empty_schema
name: empty_schema
description: A schema with no classes
`;
    const expected: LinkmlModel = {
      schema: {
        id: "http://example.com/empty_schema",
        name: "empty_schema",
        description: "A schema with no classes",
      },
    };
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
  });
});
