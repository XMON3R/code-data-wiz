//import { UniversalModel, Entity, Property } from "../../data-model-api/universal-model";
//import { OfnModel } from "./ofn-model";
//import { DomainModelAdapter } from "../../data-model-api/domain-specific-model-api";

/*
export class OfnAdapter implements DomainModelAdapter<OfnModel> {
  
  /**
   * Converts the domain-specific OfnModel into the UniversalModel.
   * It represents the OFN vocabulary as a single entity.
   */
  
  /*


  async toUniversalModel(model: OfnModel): Promise<UniversalModel> {
    const properties: Property[] = [];

    // Iterate over the keys of the OfnModel and create properties
    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        const value = model[key as keyof OfnModel];
        
        // For complex objects (like name, description), we stringify them.
        // For simple values, we use them directly.
        const propertyValue = (typeof value === 'object' && value !== null) 
          ? JSON.stringify(value) 
          : String(value ?? '');

        properties.push({
          label: key,
          // The domainSpecificType can hold a hint about the original type
          type: { domainSpecificType: typeof value },
          // Store the actual value in a new 'value' field in the Property
          value: propertyValue, 
        });
      }
    }

    const entity: Entity = {
      label: "OFN Vocabulary",
      properties: properties,
    };

    return { entities: [entity] };
  }

  /**
   * Converts the UniversalModel back into an OfnModel.
   */






  /*
  async fromUniversalModel(mainModel: UniversalModel): Promise<OfnModel> {
    const ofnData: Partial<OfnModel> = {};
    
    // Expecting a single entity representing the OFN vocabulary
    const entity = mainModel.entities[0];

    if (entity && entity.properties) {
      entity.properties.forEach(prop => {
        const key = prop.label as keyof OfnModel;
        const value = (prop as any).value; // Get the value we stored

        try {
          // Attempt to parse the value if it's a JSON string
          const parsedValue = JSON.parse(value);
          ofnData[key] = parsedValue;
        } catch (e) {
          // If it's not a valid JSON string, use it as is
          ofnData[key] = value;
        }
      });
    }

    // The result needs to conform to OfnModel, so we cast it.
    // A more robust implementation would have validation here.
    return ofnData as OfnModel;
  }
}





*/