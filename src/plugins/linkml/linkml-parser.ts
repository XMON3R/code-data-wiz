import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";
import * as yaml from "js-yaml";
import { LinkmlModel } from "./linkml-model";

/**
 * A parser for LinkML schema strings (YAML format) into a LinkmlModel.
 */
export class LinkmlParser implements DomainTextParser<LinkmlModel> {
    /**
     * Parses a LinkML schema string into a LinkmlModel.
     * @param text The LinkML schema as a string (expected to be in YAML format).
     * @returns A Promise resolving to the LinkmlModel.
     * @throws Error if the LinkML schema string is invalid or malformed.
     */
    async parseText(text: string): Promise<LinkmlModel> {
        try {
            // js-yaml's loadAll can handle multiple YAML documents, but LinkML typically uses a single document.
            // We take the last document, assuming it's the primary schema.
            const documents = yaml.loadAll(text);
            const lastDocument = documents[documents.length - 1];

            // Validate that the parsed schema is an object (as expected for a LinkML schema).
            if (lastDocument === null || typeof lastDocument !== 'object') {
                throw new Error("Invalid LinkML structure: The root of the schema must be an object.");
            }

            return { schema: lastDocument };
        } catch (e: any) {
            // Re-throw with a consistent error message for the tests to catch.
            console.error("LinkML Parsing Error:", e.message);
            throw new Error("Failed to parse LinkML schema.");
        }
    }
}
