import { UniversalModel, Entity, Property, Relationship, RelationshipType } from "../../data-model-api/universal-model";
import { SQLDiagram, SQLTable, SQLColumn, SQLDataType } from "./sql-model";
import { DomainModelAdapter } from "../../data-model-api/domain-specific-model-api";
import { toUniversalType, fromUniversalType } from "./sql-vocabulary";

/**
 * Adapter that converts between domain-specific SQLDiagram models
 * and a generic UniversalModel format used for visualization and translation.
 */
export class SqlAdapter implements DomainModelAdapter<SQLDiagram> {

    /**
     * Converts a domain-specific SQLDiagram into a generic UniversalModel.
     * Useful for visualization and translation into other formats.
     *
     * @param domainModel The SQLDiagram to convert.
     * @returns A promise that resolves to the UniversalModel.
     */
    async toUniversalModel(domainModel: SQLDiagram): Promise<UniversalModel> {
        const entities: Entity[] = domainModel.tables.map((table): Entity => {
            const entity: Entity = {
                label: table.name,
                properties: table.columns.map((column): Property => {
                    // Create string representation of the type (e.g., VARCHAR(255))
                    let typeString = column.type.name;
                    if (column.type.parameters?.length) {
                        typeString += `(${column.type.parameters.join(", ")})`;
                    }

                    const prop: Property = {
                        label: column.name,
                        type: toUniversalType(typeString),
                    };

                    // Serialize additional property metadata like nullability and default value
                    const value: any = {};
                    if (column.isNullable !== undefined) value.isNullable = column.isNullable;
                    if (column.defaultValue !== undefined) value.defaultValue = column.defaultValue;
                    if (Object.keys(value).length > 0) {
                        prop.value = JSON.stringify(value);
                    }

                    return prop;
                })
            };

            // Serialize table-level constraints into entity.value
            if (table.constraints?.length) {
                entity.value = JSON.stringify({
                    ...(entity.value || {}),
                    constraints: table.constraints,
                });
            }

            return entity;
        });

        const relationships: Relationship[] = [];

        // Convert foreign key constraints into relationships
        domainModel.tables.forEach(table => {
            table.constraints?.forEach(constraint => {
                if (constraint.type === 'FOREIGN KEY' && constraint.references) {
                    relationships.push({
                        sourceEntityLabel: table.name,
                        targetEntityLabel: constraint.references.table,
                        type: RelationshipType.Association,
                        label: constraint.name,
                    });
                }
            });
        });

        return { entities, relationships };
    }

    /**
     * Converts a generic UniversalModel back into a domain-specific SQLDiagram.
     * Useful for exporting edited models or regenerating SQL code.
     *
     * @param universalModel The UniversalModel to convert.
     * @returns A promise that resolves to the SQLDiagram.
     */
    async fromUniversalModel(universalModel: UniversalModel): Promise<SQLDiagram> {
        const tables: SQLTable[] = universalModel.entities.map((entity): SQLTable => {
            const table: SQLTable = {
                name: entity.label,
                columns: entity.properties
                    .filter(prop => {
                        // Filter out methods (not actual DB columns)
                        let isMethod = false;
                        if (prop.value) {
                            try {
                                const propMeta = JSON.parse(prop.value);
                                isMethod = propMeta.isMethod === true;
                            } catch (e) {
                                console.error(`Failed to parse prop.value for ${prop.label}:`, e);
                            }
                        }
                        return !isMethod;
                    })
                    .map((prop): SQLColumn => {
                        const sqlColumn: SQLColumn = {
                            name: prop.label,
                            type: this.parseDataTypeFromString(fromUniversalType(prop.type)),
                        };

                        // Restore nullable/default metadata
                        let propValue = prop.value;
                        if (typeof propValue === 'string') {
                            try {
                                propValue = JSON.parse(propValue);
                            } catch (e) {
                                console.error(`Failed to parse prop.value for ${prop.label}:`, e);
                                propValue = {};
                            }
                        }

                        if (propValue && typeof propValue === 'object') {
                            if ('isNullable' in propValue) {
                                sqlColumn.isNullable = propValue.isNullable;
                            }
                            if ('defaultValue' in propValue) {
                                sqlColumn.defaultValue = propValue.defaultValue;
                            }
                        }

                        return sqlColumn;
                    })
            };

            // Restore constraints from entity.value
            let entityValue = entity.value;
            if (typeof entityValue === 'string') {
                try {
                    entityValue = JSON.parse(entityValue);
                } catch (e) {
                    console.error(`Failed to parse entity.value for ${entity.label}:`, e);
                    entityValue = {};
                }
            }

            if (entityValue?.constraints) {
                table.constraints = entityValue.constraints;
            }

            return table;
        });

        return { tables };
    }

    /**
     * Parses a SQL type string like "VARCHAR(255)" into a structured SQLDataType.
     *
     * @param typeString The type string to parse.
     * @returns The SQLDataType object.
     */
    private parseDataTypeFromString(typeString: string): SQLDataType {
        const match = typeString.match(/(\w+)(?:\(([^)]+)\))?/);
        if (match) {
            const name = match[1].toUpperCase();
            const params = match[2]
                ? match[2].split(',').map(p => {
                    const trimmed = p.trim();
                    const num = Number(trimmed);
                    return isNaN(num) ? trimmed : num;
                })
                : [];
            return { name, parameters: params.length > 0 ? params : undefined };
        }
        return { name: typeString.toUpperCase() };
    }
}
