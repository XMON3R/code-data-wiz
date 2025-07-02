import { DomainTextWriter } from "../../data-model-api/domain-specific-model-api";
import { LinkmlModel } from "./linkml-model";

export class LinkmlWriter implements DomainTextWriter<LinkmlModel> {
    async writeText(model: LinkmlModel): Promise<string> {
        // For simplicity, we'll stringify the schema object.
        // In a real scenario, this would involve serializing to LinkML YAML/JSON format.
        return Promise.resolve(JSON.stringify(model.schema, null, 2));
    }
}
