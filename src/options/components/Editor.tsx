import AceEditor from "react-ace";
import type { IMarker } from "react-ace";
import "brace/mode/css";
import "brace/theme/tomorrow";
import "brace/ext/language_tools";

const markers: IMarker[] = [
  {
    startRow: 3,
    startCol: 1,
    endRow: 4,
    endCol: 1,
    className: "css-editor",
    type: "text",
    inFront: true,
  },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const Editor = (props: Props) => {
  const { value, onChange } = props;

  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <AceEditor
      mode="css"
      theme="tomorrow"
      onChange={handleChange}
      placeholder={`#pagetop-head-logo{\n  display: none;\n}`}
      width="100%"
      name="ace-editor"
      editorProps={{ $blockScrolling: false }}
      value={value}
      showGutter={true}
      highlightActiveLine={true}
      showPrintMargin={true}
      fontSize={15}
      lineHeight={20}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2,
      }}
      style={{
        width: "100%",
        height: "300px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
      markers={markers}
    />
  );
};
