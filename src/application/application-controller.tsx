import { UniversalModel } from "../data-model-api/index.ts";
import { EditorType } from "../plugins";
import { ApllicationState } from "./application-state.tsx";

export interface ApplicationController {
    
    onChangeLeftEditorType: (value:EditorType) => void;

    onChangeRightEditorType: (value:EditorType) => void;

    onChangeValue: (value: UniversalModel) => void;

}

export function useController (
    setState: (update: (state:ApllicationState) => ApllicationState) => void;
) :ApplicationController {

    return {
        onChangeLeftEditorType: (value) => setState(state => {
            return {
                ...state,
                leftEditorType: value,
            }
        }),
    }
}