
export function csharpEditor ( 
    props: {
        value: UniversalModel,
        onChange: (value:UniversalModel) => void,
        readonly?: boolean,
    }
) {
    
    const writer = new CsharpVocabularyWriter(); 

    const csharpModel = new CsharpVocabularyAdapter();

    const stringValue = writer.write(
        csharpModel.toJsonVocabulary(props.value));

    const reader = new CsharpVocabularyReader();
    csharpModel.fromJsonVocabulary();

    return (
        <CodeMirrorEditor value={stringValue} />;
    )
}