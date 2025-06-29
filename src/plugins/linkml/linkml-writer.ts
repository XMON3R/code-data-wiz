import { DomainTextWriter } from "../../data-model-api/domain-specific-model-api";
import { LinkmlModel } from "./linkml-model";

export class LinkmlWriter implements DomainTextWriter<LinkmlModel> {
    async writeText(model: LinkmlModel): Promise<string> {
        return Promise.resolve(model.linkml);
    }
}
