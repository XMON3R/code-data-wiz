import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";
import { LinkmlModel } from "./linkml-model";

export class LinkmlParser implements DomainTextParser<LinkmlModel> {
    async parseText(text: string): Promise<LinkmlModel> {
        return Promise.resolve(new LinkmlModel(text));
    }
}
