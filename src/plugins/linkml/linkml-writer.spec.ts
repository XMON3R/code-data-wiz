import { describe, it, expect } from "vitest";
import { LinkmlWriter } from "./linkml-writer";
import { LinkmlModel } from "./linkml-model";

describe("LinkmlWriter", () => {
  const writer = new LinkmlWriter();

  it("should write a LinkmlModel to a JSON string", async () => {
    const model: LinkmlModel = {
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
        },
      },
    };
    const expected = JSON.stringify(
      {
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
        },
      },
      null,
      2
    );
    const result = await writer.writeText(model);
    expect(result).toEqual(expected);
  });

  it("should return an empty JSON object string for an empty LinkmlModel schema", async () => {
    const model: LinkmlModel = {
      schema: {},
    };
    const expected = `{}`;
    const result = await writer.writeText(model);
    expect(result).toEqual(expected);
  });

  it("should throw an error for null LinkmlModel input", async () => {
    const model: LinkmlModel = null as any; // Simulate invalid input
    await expect(writer.writeText(model)).rejects.toThrow(TypeError);
  });

  it("should throw an error for undefined LinkmlModel input", async () => {
    const model: LinkmlModel = undefined as any; // Simulate invalid input
    await expect(writer.writeText(model)).rejects.toThrow(TypeError);
  });

  it("should handle a LinkmlModel with null schema gracefully", async () => {
    const model: LinkmlModel = {
      schema: null as any, // Simulate null schema
    };
    const expected = `null`;
    const result = await writer.writeText(model);
    expect(result).toEqual(expected);
  });
});
