import { OfnModel } from "./ofn-model";
import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";

export class OfnParser implements DomainTextParser<OfnModel> {
  async parseText(text: string): Promise<OfnModel> {
      try {
          const rawData = JSON.parse(text);

          // Map the raw data to the OfnModel interface
          const ofnModel: OfnModel = {
              iri: rawData.iri,
              name: rawData.název, // Map 'název' to 'name'
              description: rawData.popis, // Map 'popis' to 'description'
              createdAt: rawData.vytvořeno?.datum || rawData.vytvořeno?.datum_a_čas,
              updatedAt: rawData.aktualizováno?.datum || rawData.aktualizováno?.datum_a_čas,
          };
          
          // Add any other top-level properties from the source JSON
          Object.keys(rawData).forEach(key => {
            if (!(key in ofnModel) && !['název', 'popis', 'vytvořeno', 'aktualizováno'].includes(key)) {
                (ofnModel as any)[key] = rawData[key];
            }
          });

          return ofnModel;

      } catch (error) {
          console.error("Error parsing OFN JSON:", error);
          throw new Error("Failed to parse OFN JSON");
      }
  }
}