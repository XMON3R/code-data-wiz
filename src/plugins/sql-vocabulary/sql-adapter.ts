// src/plugins/sql-vocabulary/sql-adapter.ts
import { UniversalModel, Entity, Property } from "../../data-model-api/universal-model";
import { SQLDiagram, SQLTable, SQLColumn, SQLDataType } from "./sql-model";
import { DomainModelAdapter } from "../../data-model-api/domain-specific-model-api";

export class SqlAdapter implements DomainModelAdapter<SQLDiagram> {
    async toUniversalModel(domainModel: SQLDiagram): Promise<UniversalModel> {
        const entities: Entity[] = domainModel.tables.map((table): Entity => ({
            label: table.name,
            properties: table.columns.map((column): Property => {
                // Format the structured type back into a string for the universal model
                let typeString = column.type.name;
                if (column.type.parameters && column.type.parameters.length > 0) {
                    typeString += `(${column.type.parameters.join(", ")})`;
                }

                return {
                    label: column.name,
                    type: {
                        domainSpecificType: typeString
                    }
                };
            })
        }));

        return { entities };
    }

    async fromUniversalModel(universalModel: UniversalModel): Promise<SQLDiagram> {
        const tables: SQLTable[] = universalModel.entities.map((entity): SQLTable => ({
            name: entity.label,
            columns: entity.properties.map((prop): SQLColumn => ({
                name: prop.label,
                // This part needs to parse the string from domainSpecificType
                // back into a structured SQLDataType.
                type: this.parseDataTypeFromString(prop.type.domainSpecificType)
            }))
        }));

        return { tables };
    }

    /**
     * Helper to parse a string like "VARCHAR(255)" into a structured object.
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
