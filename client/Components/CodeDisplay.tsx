import React from 'react';
import useScript from '../hooks/useScript';
import { UnControlled as CodeMirror } from '../../node_modules/react-codemirror2';
import '../../node_modules/codemirror/mode/javascript/javascript';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../node_modules/codemirror/theme/dracula.css';

interface Props {
  schema: string;
  handleclick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const CodeDisplay: React.FC<Props> = (schema, handleClick) => {
  useScript('../client/fileSave.js');
  const invisStyle = {
    display: 'none',
  };
  return (
    <div id="codemirror-div">
      <CodeMirror
        className="codemirror"
        id="codemirror"
        value={schema}
        options={{
          mode: 'javascript',
          theme: 'dracula',
          lineNumbers: true,
          lineWrapping: true,
        }}
      />
      <button className="main-btn" onClick={(e) => handleClick(e)}>
        Back
      </button>
      <button className="main-btn" id="save-file">
        Save File
      </button>
      <p id="invisible" style={invisStyle}>
        {schema}
      </p>
    </div>
  );
};
