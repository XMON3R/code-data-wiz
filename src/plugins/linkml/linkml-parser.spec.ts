import { expect, test } from "vitest";
import { LinkmlParser } from "./linkml-parser";
import { LinkmlModel } from "./linkml-model";

const parser = new LinkmlParser();

test("should parse a LinkML string into a LinkmlModel", async () => {
    const input = `
schema:
  name: my_schema
  description: A simple LinkML schema
classes:
  Person:
    attributes:
      name:
        range: string
      age:
        range: integer
`;
    const expected: LinkmlModel = new LinkmlModel(input);
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});

test("should return an empty LinkmlModel for an empty input string", async () => {
    const input = "";
    const expected: LinkmlModel = new LinkmlModel(input);
    const result = await parser.parseText(input);
    expect(result).toEqual(expected);
});
