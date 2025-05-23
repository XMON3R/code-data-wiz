import { UniversalModel } from "./universal-model";

/**
 * Base interface for any domain-specific model.
 * All concrete domain models (e.g., OfnModel, CsharpModel) should extend this.
 * It can be empty if no common properties are shared, or include common metadata.
 */
export interface DomainSpecificModel {
    // Example: A common identifier for all domain models, if applicable
    // id?: string;

    //this will be used to make universal model
}

/**
 * Interface for a parser that converts a text string into a specific DomainSpecificModel.
 * @template T The type of the DomainSpecificModel that this parser produces.
 */
export interface DomainTextParser<T extends DomainSpecificModel> {
    /**
     * Parses a text string into an instance of the specified DomainSpecificModel.
     * @param text The input text string (e.g., JSON, XML, custom DSL).
     * @returns A Promise that resolves with the parsed DomainSpecificModel.
     */
    parseText(text: string): Promise<T>;
}

/**
 * Interface for a writer that converts a specific DomainSpecificModel into a text string.
 * @template T The type of the DomainSpecificModel that this writer consumes.
 */
export interface DomainTextWriter<T extends DomainSpecificModel> {
    /**
     * Writes an instance of the specified DomainSpecificModel to a text string.
     * @param model The DomainSpecificModel instance to write.
     * @returns A Promise that resolves with the generated text string.
     */
    writeText(model: T): Promise<string>;
}

/**
 * Interface for an adapter that converts between a DomainSpecificModel and the UniversalModel.
 * This is crucial for integrating domain-specific data with the core application's universal representation.
 * @template D The type of the DomainSpecificModel this adapter handles.
 */
export interface DomainModelAdapter<D extends DomainSpecificModel> {
    /**
     * Converts a DomainSpecificModel instance into the application's UniversalModel.
     * @param domainModel The domain-specific model to convert.
     * @returns A Promise that resolves with the UniversalModel representation.
     */
    toUniversalModel(domainModel: D): Promise<UniversalModel>;

    /**
     * Converts the application's UniversalModel into a DomainSpecificModel.
     * @param universalModel The UniversalModel to convert.
     * @returns A Promise that resolves with the domain-specific model representation.
     */
    fromUniversalModel(universalModel: UniversalModel): Promise<D>;
}

/**
 * The "merged" API for a specific domain, providing all capabilities
 * for handling that domain's model: parsing its text format, writing to its text format,
 * and adapting it to/from the UniversalModel.
 * @template D The type of the DomainSpecificModel this API provides services for.
 */
export interface DomainSpecificModelApi<D extends DomainSpecificModel> {
    /**
     * The parser for this domain's text format.
     */
    parser: DomainTextParser<D>;
    /**
     * The writer for this domain's text format.
     */
    writer: DomainTextWriter<D>;
    /**
     * The adapter for converting between this domain's model and the UniversalModel.
     */
    adapter: DomainModelAdapter<D>;
}