import React, { useContext } from 'react';
import { UnControlled as CodeMirror } from '../../node_modules/react-codemirror2';
import '../../node_modules/codemirror/mode/javascript/javascript';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../node_modules/codemirror/theme/dracula.css';
import { Header } from './Header';
const { packagejsonCreator } = require("../templateFunctions/packagejsonCreator");
const { serverCreator } = require("../templateFunctions/serverCreator");
const { dbconnectCreator } = require("../templateFunctions/dbconnectCreator");
const { schemaCreator } = require("../templateFunctions/schemaCreator");
const JSZip = require("jszip");
const FileSaver = require('file-saver');
const { UserContext } = require("../context/UserContext");

export const CodeDisplay: React.FC = (props) => {
  // For use with Electron
  // useScript('../client/fileSave.js');
  const { uri, schema, addDisplayCode } = useContext(UserContext);

  // for CodeDisplay.jsx/Back button
  const handleClick = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.preventDefault();
      addDisplayCode(false);
    };

  const handleSchemaDownload = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    console.log('URI :', uri)
    const zip = new JSZip();
    zip.folder('torchql').file('yourSchema.js', schema);
    zip.generateAsync({type:"blob"}).then(function(content:any) {
        FileSaver.saveAs(content, "torchql.zip");
    });
  };
  // download zip file containing all files for testing schema and resolvers
  const handleDownload = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    console.log('URI :', uri)
    const zip = new JSZip();
    zip.folder('torchql').file("package.json", packagejsonCreator());
    zip.folder('torchql').folder('server').file("server.js", serverCreator());
    zip.folder('torchql').folder('server').file("dbConnect.js", dbconnectCreator(uri));
    zip.folder('torchql').folder('server').file('schema.js', schemaCreator(schema));
    zip.generateAsync({type:"blob"}).then(function(content:any) {
        FileSaver.saveAs(content, "torchql.zip");
    });
  };

  const handleWriteMockserver = (
    link: string, text: string
  ) => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ db: dbconnectCreator(link), schema: schemaCreator(text) }),
    };
  
    fetch('/db/pg/writefiles', options)
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <div id="codemirror-div">
      <Header />
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
        onClick={(e) => handleSchemaDownload(e)}
      >
        Save
      </button>
      <button
        className="main-btn"
        id="save-file"
        onClick={(e) => handleDownload(e)}
      >
        Save/Test
      </button>
      <button
        className="main-btn"
        onClick={(e) => {
          e.preventDefault();
          handleWriteMockserver(uri, schema);
          setTimeout(() => {
            window.location.href="http://www.torchql.dev/playground";
          }, 3000);
          }}
      > Test
      </button>
    </div>
  );
};
