import { UniversalModel } from "../data-model-api";
import { EditorType } from "../plugins";

export interface ApllicationState {

    leftEditorType: EditorType;

    rightEditorType: EditorType;

    value: UniversalModel;
}

export function createDefaultApplicationState(): ApllicationState {
    return {
        leftEditorType: EditorType.ClassDiagram,
        rightEditorType: EditorType.ClassDiagram,
        value: {
            entities: []
        }
    };
}