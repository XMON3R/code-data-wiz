import { UniversalModel } from "../data-model-api/index.ts";
import { EditorType } from "../plugins";
import { ApllicationState } from "./application-state.tsx";

/**
 * Defines the interface for the application controller.
 */
export interface ApplicationController {
    /**
     * Handles changes to the left editor type.
     * @param value The new editor type for the left editor.
     */
    onChangeLeftEditorType: (value: EditorType) => void;

    /**
     * Handles changes to the right editor type.
     * @param value The new editor type for the right editor.
     */
    onChangeRightEditorType: (value: EditorType) => void;

    /**
     * Handles changes to the universal model value.
     * @param value The new universal model.
     */
    onChangeValue: (value: UniversalModel) => void;
}

/**
 * A React hook that provides a controller for managing the application state.
 * @param setState A function to update the application state.
 * @returns An `ApplicationController` object.
 */
export function useController(
    setState: (update: (state: ApllicationState) => ApllicationState) => void
): ApplicationController {
    return {
        onChangeLeftEditorType: (value) =>
            setState((state) => ({
                ...state,
                leftEditorType: value,
            })),
        onChangeRightEditorType: (value) =>
            setState((state) => ({
                ...state,
                rightEditorType: value,
            })),
        onChangeValue: (value) =>
            setState((state) => ({
                ...state,
                value: value,
            })),
    };
}
