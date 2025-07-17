import { OfnModel, OfnModelConcept } from "./ofn-model";
import { DomainTextParser } from "../../data-model-api/domain-specific-model-api";

export class OfnParser implements DomainTextParser<OfnModel> {
  async parseText(text: string): Promise<OfnModel> {
      try {
          const rawData = JSON.parse(text);

          const ofnModel: OfnModel = {
              context: rawData["@context"],
              iri: rawData.iri,
              type: rawData.typ,
              name: rawData.název,
              description: rawData.popis,
              createdAt: rawData.vytvořeno ? { type: rawData.vytvořeno.typ, date: rawData.vytvořeno.datum || rawData.vytvořeno.datum_a_čas } : undefined,
              updatedAt: rawData.aktualizováno ? { type: rawData.aktualizováno.typ, dateTime: rawData.aktualizováno.datum || rawData.aktualizováno.datum_a_čas } : undefined,
              concepts: [],
          };

          if (rawData.pojmy && Array.isArray(rawData.pojmy)) {
              ofnModel.concepts = rawData.pojmy.map((rawConcept: any) => { // Explicitly typed rawConcept as any
                  const concept: OfnModelConcept = {
                      iri: rawConcept.iri,
                      type: rawConcept.typ,
                      name: rawConcept.název,
                      definition: rawConcept.definice,
                      relatedLegalProvision: rawConcept.související_ustanovení_právního_předpisu,
                      equivalentConcept: rawConcept.ekvivalentní_pojem,
                      description: rawConcept.popis,
                      ignored: {},
                  };

                  // Ignore "Koncept" and "Pojem" types
                  if (concept.type?.includes("Koncept") || concept.type?.includes("Pojem")) {
                      // We can choose to either filter these out entirely or keep them with a flag.
                      // For now, let's keep them but mark them as ignored if they are not also a Class, Relation, or Property.
                      if (!concept.type?.includes("Třída") && !concept.type?.includes("Vztah") && !concept.type?.includes("Vlastnost")) {
                          concept.ignored!["Koncept/Pojem"] = "Ignored as per OFN rules.";
                          // Optionally, you could return null here to filter them out completely:
                          // return null;
                      }
                  }

                  // Handle "Třída" (Class) - Inheritance
                  if (concept.type?.includes("Třída")) {
                      concept.subClassOf = rawConcept["nadřazená-třída"];
                  }

                  // Handle "Vztah" (Relation) and "Vlastnost" (Property)
                  if (concept.type?.includes("Vztah") || concept.type?.includes("Vlastnost")) {
                      concept.domain = rawConcept["definiční-obor"];
                      concept.range = rawConcept["obor-hodnot"];
                  }

                  // Ignore "nadřazený-vztah" and add a comment
                  if (rawConcept["nadřazený-vztah"]) {
                      concept.ignored!["nadřazený-vztah"] = "Ignored as per OFN rules.";
                  }

                  return concept;
              }).filter((concept: OfnModelConcept | null): concept is OfnModelConcept => concept !== null); // FIX: Explicitly typed the 'concept' parameter and used a type guard.
          }

          // Add any other top-level properties from the source JSON that were not explicitly mapped
          Object.keys(rawData).forEach(key => {
            if (!(key in ofnModel) && !['název', 'popis', 'vytvořeno', 'aktualizováno', 'pojmy', 'iri'].includes(key)) {
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
