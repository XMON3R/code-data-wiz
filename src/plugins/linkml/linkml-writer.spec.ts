import { expect, test } from "vitest";
import { LinkmlWriter } from "./linkml-writer";
import { LinkmlModel } from "./linkml-model";

const writer = new LinkmlWriter();

test("should write a LinkmlModel to a LinkML string", async () => {
    const expected = `
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
    const model: LinkmlModel = new LinkmlModel(expected);
    const result = await writer.writeText(model);
    expect(result).toEqual(expected);
});

test("should return an empty string for an empty LinkmlModel", async () => {
    const expected = "";
    const model: LinkmlModel = new LinkmlModel(expected);
    const result = await writer.writeText(model);
    expect(result).toEqual(expected);
});
