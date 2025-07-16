import { UniversalModel } from "../data-model-api";
import { EditorType } from "../plugins";

export interface ApllicationState {

    leftEditorType: EditorType;

    rightEditorType: EditorType;

    value: UniversalModel;
}

export function createDefaultApplicationState(): ApllicationState {
    return {
        leftEditorType: EditorType.SQLQuery,
        rightEditorType: EditorType.Csharp,
        value: {
            entities: []
        }
    };
}