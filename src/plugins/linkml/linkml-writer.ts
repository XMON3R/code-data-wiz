import { DomainTextWriter } from "../../data-model-api/domain-specific-model-api";
import { LinkmlModel } from "./linkml-model";
import yaml from 'js-yaml';

/**
 * A writer that converts a LinkmlModel object into a YAML string.
 */
export class LinkmlWriter implements DomainTextWriter<LinkmlModel> {
    async writeText(model: LinkmlModel): Promise<string> {
        // Handle null or undefined model input by throwing an error
        if (model === null || model === undefined) {
            throw new TypeError("LinkmlModel input cannot be null or undefined.");
        }

        // Handle null schema gracefully as per test expectations
        if (model.schema === null) {
            return "null";
        }

        // Convert the schema to YAML string with indentation
        // The 'js-yaml' library's dump function can be used for this.
        // We use 'null' for the replacer and 2 for the indent level for pretty printing.
        return yaml.dump(model.schema, { indent: 2 });
    }
}
