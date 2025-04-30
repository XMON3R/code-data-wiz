import { CodeMirrorEditor } from "../components/code-mirror-editor";
import { UniversalModel } from '../../data-model-api';
import { useEffect, useState } from "react";

// Assuming these classes are in separate files.  Adjust the paths as necessary.
class CsharpVocabularyWriter {
    write(jsonVocabulary: any): string {
        //  Implementation:  Convert the JSON representation of the vocabulary
        //  into a C#-specific string format.
        //  For the mock, we'll just return the JSON string.
        console.log("CsharpVocabularyWriter.write called with:", jsonVocabulary);
        return JSON.stringify(jsonVocabulary, null, 2); // Pretty print for readability
    }
}

class CsharpVocabularyAdapter {
    toJsonVocabulary(universalModel: UniversalModel): any {
        //  Implementation:  Convert the UniversalModel into a JSON
        //  representation that the CsharpVocabularyWriter can understand.
        //  For the mock, we'll simplify and assume a direct conversion is possible.
        console.log("CsharpVocabularyAdapter.toJsonVocabulary called with:", universalModel);
        return universalModel; //  In a real scenario, you'd transform the structure.
    }

    fromJsonVocabulary(jsonVocabulary: any): UniversalModel {
      console.log("CsharpVocabularyAdapter.fromJsonVocabulary called with:", jsonVocabulary);
        //  Implementation: Convert the JSON representation of the vocabulary
        //  (from C#) back into a UniversalModel.
        //  For the mock, we'll assume the input is already a valid UniversalModel
        //  and return it directly.  In a real scenario, you'd parse and transform.
        return jsonVocabulary;
    }
}

class CsharpVocabularyReader {
  read(csharpString: string): any {
    console.log("CsharpVocabularyReader.read with csharpString", csharpString);
    try {
      const json = JSON.parse(csharpString);
      return json;
    } catch (e) {
      console.error("CsharpVocabularyReader.read: could not parse csharpString", csharpString, e);
      return null; // or throw an error
    }
  }
}


export function csharpEditor(props: {
    value: UniversalModel;
    onChange: (value: UniversalModel) => void;
    readonly?: boolean;
}) {
    const [editorValue, setEditorValue] = useState<string>('');
    const writer = new CsharpVocabularyWriter();
    const csharpModel = new CsharpVocabularyAdapter();
    const reader = new CsharpVocabularyReader();

    // Convert UniversalModel to string for CodeMirrorEditor on initial load or when props.value changes
    useEffect(() => {
        const jsonValue = csharpModel.toJsonVocabulary(props.value);
        const csharpStringValue = writer.write(jsonValue);
        setEditorValue(csharpStringValue);
    }, [props.value, csharpModel, writer]); //  Dependencies array

    const handleEditorChange = (value: string) => {
        try {
            //  Parse the string value from the editor into a JSON-like structure
            const jsonValue = reader.read(value);

            // Convert the JSON-like structure back to UniversalModel
            const newUniversalModel = csharpModel.fromJsonVocabulary(jsonValue);

            //  Call the onChange prop to update the parent component's state
            props.onChange(newUniversalModel);
        } catch (error) {
            console.error('Error handling editor change:', error);
            //  In a real app, you'd want to show user feedback here,
            //  e.g., an error message in the UI.  For now, we just log it.
        }
    };

    return (
        <CodeMirrorEditor
            value={editorValue}
            onChange={handleEditorChange}
            readOnly={props.readonly}
        />
    );
}