import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";
import { LinkmlModel, LinkmlSchema } from "./linkml-model";
import { load } from "js-yaml"; // Assuming js-yaml is available or can be installed

export class LinkmlParser implements DomainTextParser<LinkmlModel> {
    async parseText(text: string): Promise<LinkmlModel> {
        try {
            const schema = load(text) as LinkmlSchema;
            return Promise.resolve({ schema });
        } catch (error) {
            console.error("Error parsing LinkML text:", error);
            throw new Error("Failed to parse LinkML schema.");
        }
    }
}
