import { UniversalModel, Entity, Property, Relationship, RelationshipType } from "../../data-model-api/universal-model";
import { SQLDiagram, SQLTable, SQLColumn, SQLDataType } from "./sql-model";
import { DomainModelAdapter } from "../../data-model-api/domain-specific-model-api";
import { toUniversalType, fromUniversalType } from "./sql-vocabulary";

export class SqlAdapter implements DomainModelAdapter<SQLDiagram> {
    /**
     * Converts a domain-specific SQLDiagram into a generic UniversalModel.
     * @param domainModel The SQLDiagram to convert.
     * @returns A promise that resolves to the UniversalModel.
     */
    async toUniversalModel(domainModel: SQLDiagram): Promise<UniversalModel> {
        const entities: Entity[] = domainModel.tables.map((table): Entity => {
            const entity: Entity = {
                label: table.name,
                properties: table.columns.map((column): Property => {
                    // Format the structured type back into a string for the universal model
                    let typeString = column.type.name;
                    if (column.type.parameters && column.type.parameters.length > 0) {
                        typeString += `(${column.type.parameters.join(", ")})`;
                    }

                    const prop: Property = {
                        label: column.name,
                        type: toUniversalType(typeString),
                    };

                    // Create a value object only if there are properties to add
                    const value: any = {};
                    if (column.isNullable !== undefined) {
                        value.isNullable = column.isNullable;
                    }
                    if (column.defaultValue !== undefined) {
                        value.defaultValue = column.defaultValue;
                    }

                    if (Object.keys(value).length > 0) {
                        prop.value = JSON.stringify(value);
                    }

                    return prop;
                })
            };

            // Add constraints to the entity's value property for round-tripping
            if (table.constraints && table.constraints.length > 0) {
                entity.value = JSON.stringify({
                    ...(entity.value || {}), // Ensure entity.value is an object if it exists
                    constraints: table.constraints,
                });
            }

            return entity;
        });

        const relationships: Relationship[] = [];

        domainModel.tables.forEach(table => {
            if (table.constraints) {
                table.constraints.forEach(constraint => {
                    if (constraint.type === 'FOREIGN KEY' && constraint.references) {
                        relationships.push({
                            sourceEntityLabel: table.name,
                            targetEntityLabel: constraint.references.table,
                            type: RelationshipType.Association, // Default to association, can be refined if more info is available
                            label: constraint.name, // Use constraint name as relationship label
                            // Cardinalities can be inferred or added if SQL model provides more detail
                        });
                    }
                });
            }
        });

        return { entities, relationships };
    }

    /**
     * Converts a generic UniversalModel back into a domain-specific SQLDiagram.
     * @param universalModel The UniversalModel to convert.
     * @returns A promise that resolves to the SQLDiagram.
     */
    async fromUniversalModel(universalModel: UniversalModel): Promise<SQLDiagram> {
        const tables: SQLTable[] = universalModel.entities.map((entity): SQLTable => {
            const table: SQLTable = {
                name: entity.label,
                columns: entity.properties.map((prop): SQLColumn => {
                    const sqlColumn: SQLColumn = {
                        name: prop.label,
                        type: this.parseDataTypeFromString(fromUniversalType(prop.type))
                    };

                    // Parse isNullable and defaultValue from the universal model's value field.
                    let propValue = prop.value;
                    if (typeof propValue === 'string') {
                        try {
                            propValue = JSON.parse(propValue);
                        } catch (e) {
                            console.error(`Failed to parse prop.value for ${prop.label}:`, e);
                            propValue = {}; // Reset to empty object on parse error
                        }
                    }

                    if (propValue && typeof propValue === 'object') {
                        if (Object.prototype.hasOwnProperty.call(propValue, 'isNullable')) {
                            sqlColumn.isNullable = propValue.isNullable;
                        }
                        if (Object.prototype.hasOwnProperty.call(propValue, 'defaultValue')) {
                            sqlColumn.defaultValue = propValue.defaultValue;
                        }
                    }
                    return sqlColumn;
                })
            };

            // Restore constraints from the entity's value property
            let entityValue = entity.value;
            if (typeof entityValue === 'string') {
                try {
                    entityValue = JSON.parse(entityValue);
                } catch (e) {
                    console.error(`Failed to parse entity.value for ${entity.label}:`, e);
                    entityValue = {}; // Reset to empty object on parse error
                }
            }

            if (entityValue && entityValue.constraints) {
                table.constraints = entityValue.constraints;
            }

            return table;
        });

        return { tables };
    }

    /**
     * Helper to parse a string like "VARCHAR(255)" into a structured SQLDataType object.
     * @param typeString The string representation of the data type.
     * @returns A structured SQLDataType object.
     */
    private parseDataTypeFromString(typeString: string): SQLDataType {
        const match = typeString.match(/(\w+)(?:\(([^)]+)\))?/);
        if (match) {
            const name = match[1].toUpperCase();
            const params = match[2] ? match[2].split(',').map(p => p.trim()) : [];
            const parsedParams = params.map(p => {
                const num = Number(p);
                return isNaN(num) ? p : num;
            });
            return { name, parameters: parsedParams.length > 0 ? parsedParams : undefined };
        }
        return { name: typeString.toUpperCase() };
    }
}
