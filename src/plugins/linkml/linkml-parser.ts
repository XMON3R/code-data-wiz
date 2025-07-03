import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";
import * as yaml from "js-yaml";
import { LinkmlModel } from "./linkml-model";

export class LinkmlParser implements DomainTextParser<LinkmlModel> {
    async parseText(text: string): Promise<LinkmlModel> {
        try {
            const schema = yaml.load(text);

            // --- VALIDATION ADDED ---
            // A valid LinkML schema must have an object as its root.
            // If the parsed result is not an object (e.g., it's null, undefined, a string),
            // it's not a valid schema, so we should throw an error.
            if (schema === null || typeof schema !== 'object') {
                throw new Error("Invalid LinkML structure: The root of the schema must be an object.");
            }

            return { schema };
        } catch (e: any) {
            // Re-throw with a consistent error message for the tests to catch.
            console.error("LinkML Parsing Error:", e.message);
            throw new Error("Failed to parse LinkML schema.");
        }
    }
}
