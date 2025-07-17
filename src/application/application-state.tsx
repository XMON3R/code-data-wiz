import { UniversalModel } from "../data-model-api";
import { EditorType } from "../plugins";

/**
 * Defines the state of the application.
 */
export interface ApllicationState {
    /**
     * The type of the left editor.
     */
    leftEditorType: EditorType;

    /**
     * The type of the right editor.
     */
    rightEditorType: EditorType;

    /**
     * The universal model representing the data.
     */
    value: UniversalModel;
}

/**
 * Creates a default application state.
 * @returns The default application state.
 */
export function createDefaultApplicationState(): ApllicationState {
    return {
        leftEditorType: EditorType.SQLQuery,
        rightEditorType: EditorType.Csharp,
        value: {
            entities: []
        }
    };
}
