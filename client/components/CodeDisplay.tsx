import React, { useEffect } from 'react';
import { UnControlled as CodeMirror } from '../../node_modules/react-codemirror2';
import '../../node_modules/codemirror/mode/javascript/javascript';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../node_modules/codemirror/theme/dracula.css';
const { packagejsonCreator } = require("../templateFunctions/packagejsonCreator");
const { serverCreator } = require("../templateFunctions/serverCreator");
const JSZip = require("jszip");
var FileSaver = require('file-saver');

interface Props {
  schema: string;
  handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const CodeDisplay: React.FC<Props> = ({ schema, handleClick }) => {
  // For use with Electron
  // useScript('../client/fileSave.js');
  const invisStyle = {
    display: 'none',
  };

  // useEffect(() => {
  //   const data = { schema };
  //   fetch('/download', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data),
  //   });
  // }, []);

  const handleDownload = () => {
    const zip = new JSZip();
    zip.folder('torchql').file("package.json", packagejsonCreator());
    // zip.file("Hello.txt", "Hello World\n");
    zip.folder('torchql').folder('server').file("server.js", serverCreator());
    zip.generateAsync({type:"blob"}).then(function(content:any) {
        FileSaver.saveAs(content, "example.zip");
    });
  };
 

  return (
    <div id="codemirror-div">
      <CodeMirror
        className="codemirror"
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
      <button
        className="main-btn"
        id="save-file"
        onClick={() => handleDownload()}
      >
        Save File
      </button>
      <p id="invisible" style={invisStyle}>
        {schema}
      </p>
    </div>
  );
};
