import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";
import * as yaml from "js-yaml";
import { LinkmlModel } from "./linkml-model";

export class LinkmlParser implements DomainTextParser<LinkmlModel> {
    async parseText(text: string): Promise<LinkmlModel> {
        try {
            const documents = yaml.loadAll(text);
            const lastDocument = documents[documents.length - 1];

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
