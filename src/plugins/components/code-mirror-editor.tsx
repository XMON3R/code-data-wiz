
export function CodeMirrorEditor(props: {
    value: string,
    onChange: (value: string) => void,
}) {
    return 
        <CodeMirror
        theme="dark"
        value={value}
        width="100%"
        height={`${window.innerHeight}px`}
        onChange={onChange}
        readOnly={readOnly}
        extensions={extensions}
      />
    
}