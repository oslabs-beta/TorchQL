import React from 'react';
import useScript from '../hooks/useScript';
import { UnControlled as CodeMirror } from '../../node_modules/react-codemirror2';
import '../../node_modules/codemirror/mode/javascript/javascript';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../node_modules/codemirror/theme/dracula.css';

const CodeDisplay = (props) => {
  useScript('../client/fileSave.js');
  const invisStyle = {
    display: 'none',
  };
  return (
    <div id="codemirror-div">
      <CodeMirror
        className="codemirror"
        id="codemirror"
        value={props.schema}
        options={{
          mode: 'javascript',
          theme: 'dracula',
          lineNumbers: true,
          lineWrapping: true,
        }}
        onChange={(editor, data, value) => {}}
      />
      <button className="main-btn" onClick={(e) => props.handleClick(e)}>
        Back
      </button>
      <button className="main-btn" id="save-file">
        Save File
      </button>
      <p id="invisible" style={invisStyle}>
        {props.schema}
      </p>
    </div>
  );
};

export default CodeDisplay;
