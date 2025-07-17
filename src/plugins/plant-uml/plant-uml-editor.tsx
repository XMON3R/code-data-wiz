import { encode } from 'plantuml-encoder';
import { UniversalModel, RelationshipType } from '../../data-model-api';

/**
 * Converts a UniversalModel into PlantUML code representing the class diagram.
 *
 * - Each entity becomes a UML class with its properties.
 * - Relationships (association, composition, etc.) are drawn with correct syntax and optional cardinalities.
 * - Styling is applied for dark background and modern look.
 *
 * @param {UniversalModel} model - The universal model to render as PlantUML.
 * @returns {string} The generated PlantUML source code.
 */
export function universalModelToPlantUml(model: UniversalModel): string {
  let plantUmlCode = "@startuml\n";
  plantUmlCode += `title "Model Visualization"
skinparam titleFontColor #ffffff
skinparam classAttributeIconSize 0
skinparam style strictuml
skinparam backgroundcolor #101828
skinparam FontColor #ffffff

skinparam class {
  BackgroundColor #374151
  ArrowColor #f8fafc
  BorderColor #f8fafc
  FontColor #ffffff
}

skinparam classAttributeFontColor #ffffff
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

  if (model && model.relationships) {
    for (const rel of model.relationships) {
      const relationshipSyntax = getPlantUmlRelationshipSyntax(rel.type);
      const label = rel.label ? ` : ${rel.label}` : '';
      const sourceCardinality = rel.sourceCardinality ? ` "${rel.sourceCardinality}"` : '';
      const targetCardinality = rel.targetCardinality ? ` "${rel.targetCardinality}"` : '';
      plantUmlCode += `${rel.sourceEntityLabel} ${sourceCardinality} ${relationshipSyntax}${targetCardinality} ${rel.targetEntityLabel}${label}\n`;
    }
  }

  plantUmlCode += "@enduml\n";
  return plantUmlCode;
}

/**
 * Maps a RelationshipType to its corresponding PlantUML syntax.
 *
 * @param {RelationshipType} type - The type of relationship.
 * @returns {string} PlantUML connector for the relationship.
 */
function getPlantUmlRelationshipSyntax(type: RelationshipType): string {
  switch (type) {
    case RelationshipType.Association:
      return "-->";
    case RelationshipType.Composition:
      return "--*";
    case RelationshipType.Aggregation:
      return "--o";
    case RelationshipType.Inheritance:
      return "--|>";
    case RelationshipType.Dependency:
      return "..>";
    default:
      return "-->";
  }
}

/**
 * React component that renders a UniversalModel as a PlantUML diagram using a live image from plantuml.com.
 *
 * @param props.value - The model to visualize.
 * @returns A centered image displaying the class diagram.
 */
export function PlantUmlEditor(props: {
  value: UniversalModel;
}) {
  const plantUmlCode = universalModelToPlantUml(props.value);
  const encodedPlantUml = encode(plantUmlCode);
  const imageUrl = `http://www.plantuml.com/plantuml/svg/${encodedPlantUml}`;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100%',
        padding: '1rem',
        boxSizing: 'border-box',
        backgroundColor: '#101828',
        overflow: 'auto'
      }}
    >
      <img src={imageUrl} alt="Model Visualization" style={{ maxWidth: '100%', maxHeight: '100%' }} />
    </div>
  );
}
