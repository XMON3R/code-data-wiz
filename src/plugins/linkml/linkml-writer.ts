import { DomainTextWriter } from "../../data-model-api/domain-specific-model-api";
import * as yaml from "js-yaml";
import { LinkmlModel } from "./linkml-model";

/**
 * A writer that converts a LinkmlModel object into a YAML string.
 */
export class LinkmlWriter implements DomainTextWriter<LinkmlModel> {
    async writeText(model: LinkmlModel): Promise<string> {
        if (!model || !model.schema) {
            return "";
        }
        // Use js-yaml's dump function to serialize the schema object into a string
        return yaml.dump(model.schema);
    }
}
