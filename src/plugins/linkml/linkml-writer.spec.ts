import { describe, it, expect } from "vitest";
import { LinkmlWriter } from "./linkml-writer";
import { LinkmlModel } from "./linkml-model";
import yaml from 'js-yaml'; // Import js-yaml for generating expected YAML

describe("LinkmlWriter", () => {
  const writer = new LinkmlWriter();

  it("should write a LinkmlModel to a YAML string", async () => {
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
    // Generate the expected YAML output using js-yaml with the same options as the writer
    const expected = yaml.dump(
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
      { indent: 2, replacer: (value) => value === undefined ? null : value }
    );
    const result = await writer.writeText(model);
    expect(result).toEqual(expected);
  });

  it("should return an empty YAML object string for an empty LinkmlModel schema", async () => {
    const model: LinkmlModel = {
      schema: {},
    };
    // The expected output for an empty object in YAML is typically '{}'
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
