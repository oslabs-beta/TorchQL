import React, { useEffect, useContext } from 'react';
import { UnControlled as CodeMirror } from '../../node_modules/react-codemirror2';
import '../../node_modules/codemirror/mode/javascript/javascript';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../node_modules/codemirror/theme/dracula.css';
import e from 'express';
const { packagejsonCreator } = require("../templateFunctions/packagejsonCreator");
const { serverCreator } = require("../templateFunctions/serverCreator");
const { dbconnectCreator } = require("../templateFunctions/dbconnectCreator");
const JSZip = require("jszip");
const FileSaver = require('file-saver');
const { UserContext } = require("../context/UserContext");

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
  const { uri } = useContext(UserContext);

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

  // const handleDownload = () => {
  //   console.log('URI :', URI)
  //   const zip = new JSZip();
  //   zip.folder('torchql').file("package.json", packagejsonCreator());
  //   // zip.file("Hello.txt", "Hello World\n");
  //   zip.folder('torchql').folder('server').file("server.js", serverCreator());
  //   zip.folder('torchql').folder('server').file("dbConnect.js", dbconnectCreator(URI));
  //   zip.generateAsync({type:"blob"}).then(function(content:any) {
  //       FileSaver.saveAs(content, "example.zip");
  //   });
  // };
  const handleDownload = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    console.log('URI :', uri)
    const zip = new JSZip();
    zip.folder('torchql').file("package.json", packagejsonCreator());
    // zip.file("Hello.txt", "Hello World\n");
    zip.folder('torchql').folder('server').file("server.js", serverCreator());
    zip.folder('torchql').folder('server').file("dbConnect.js", dbconnectCreator(uri));
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
        onClick={(e) => handleDownload(e)}
      >
        Save File
      </button>
      <p id="invisible" style={invisStyle}>
        {schema}
      </p>
    </div>
  );
};
