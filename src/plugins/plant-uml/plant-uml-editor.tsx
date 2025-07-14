import { encode } from 'plantuml-encoder';
import { UniversalModel } from '../../data-model-api';

function universalModelToPlantUml(model: UniversalModel): string {
  let plantUmlCode = "@startuml\n";
  plantUmlCode += `title "Model Visualization"
skinparam classAttributeIconSize 0
skinparam style strictuml
skinparam class {
  BackgroundColor #f8fafc
  ArrowColor #64748b
  BorderColor #64748b
}
`;

  if (model && model.entities) {
    for (const entity of model.entities) {
      plantUmlCode += `class ${entity.label} {\n`;
      if (entity.properties) {
        for (const property of entity.properties) {
          const propType = property.type?.domainSpecificType ?? 'string';
          plantUmlCode += `  + ${property.label}: ${propType}\n`;
        }
      }
      plantUmlCode += "}\n";
    }
  }

  plantUmlCode += "@enduml\n";
  return plantUmlCode;
}

export function PlantUmlEditor(props: {
    value: UniversalModel;
}) {
  const plantUmlCode = universalModelToPlantUml(props.value);
  const encodedPlantUml = encode(plantUmlCode);
  const imageUrl = `http://www.plantuml.com/plantuml/svg/${encodedPlantUml}`;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '1rem', boxSizing: 'border-box', backgroundColor: '#f8fafc', overflow: 'auto' }}>
      <img src={imageUrl} alt="Model Visualization" style={{ maxWidth: '100%', maxHeight: '100%', backgroundColor: 'white' }} />
    </div>
  );
}
