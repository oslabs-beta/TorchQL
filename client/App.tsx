import React, { useState } from 'react';
import MainDisplay from './components/MainDisplay';
const { packagejsonCreator } = require("./templateFunctions/packagejsonCreator");
const { serverCreator } = require("./templateFunctions/serverCreator");
const { dbconnectCreator } = require("./templateFunctions/dbconnectCreator");
const JSZip = require("jszip");
const FileSaver = require('file-saver');

import './styles.scss';
import { json } from 'body-parser';

const App: React.FC = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [URI, setURI] = useState<string>('');
  const [schema, setSchema] = useState<string>('');
  const [displayCode, setDisplayCode] = useState<boolean>(false);

  //MySQL 
  const [host, setHost] = useState<string>('');
  const [user, setUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [database, setDatabase] = useState<string>('');

  const handleHost = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHost(e.target.value);
  };
  const handleUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatabase(e.target.value);
  };

  // Add inputted URI to search history
  const addToSearchHistory = () => {
    if (searchHistory.length < 3) {
      setSearchHistory([...searchHistory, URI]);
    } else {
        setSearchHistory([...[...searchHistory].splice(1), URI]);
      }
    setURI('');
  };

  const handleURI = (e: React.ChangeEvent<HTMLInputElement>) => {
    setURI(e.target.value);
  };


  // Fetches and returns the Postgres SDL Schema
  const handleSDLInput = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (URI !== '') {
      fetch(`/db/pg/sdl?uri=${URI}`)
        .then((data) => data.json())
        .then((data) => {
          if (data === "error") {
            setURI('');
          } else {
              addToSearchHistory();
              setSchema(data);
              setDisplayCode(true);
              console.log('schema: ', schema);
            }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  // Fetches and returns the Postgres Programmatic Schema
  const handleProgInput = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (URI !== '') {
      fetch(`/db/pg/prog?uri=${URI}`)
        .then((data) => data.json())
        .then((data) => {
          if (data === "error") {
            setURI('');
          } else {
              addToSearchHistory();
              setSchema(data);
              setDisplayCode(true);
              console.log('schema: ', schema);
            }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  // Handles and fetches the MySQL SDL Schema
  const handleMySQLSDLInput = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if ((host !== '') && (user !== '') && (password !== '') && (database !== '')){
      fetch('/db/mySQL/sdl', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ host, user, password, database })
      })
      .then((data) => data.json())
      .then((data) => {
        if (data === "error") {
          setHost('');
          setUser('');
          setPassword('');
          setDatabase('');
        } else {
            setSchema(data),
            setDisplayCode(true);
            setHost('');
            setUser('');
            setPassword('');
            setDatabase('');
          }
      })
      .catch((err) => {
        console.error(err);
      });
    }
  };

  // Handles and fetches the MySQL Programmatic Schema
  const handleMySQLProgInput = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if ((host !== '') && (user !== '') && (password !== '') && (database !== '')){
      fetch('/db/mySQL/prog', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ host, user, password, database })
      })
      .then((data) => data.json())
      .then((data) => {
        if (data === "error") {
          setHost('');
          setUser('');
          setPassword('');
          setDatabase('');
        } else {
            setSchema(data),
            setDisplayCode(true);
            setSchema(data),
            setDisplayCode(true);
            setHost('');
            setUser('');
            setPassword('');
            setDatabase('');
          }
      })
      .catch((err) => {
        console.error(err);
      });
    }
  };

  // for CodeDisplay.jsx/Back button
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setDisplayCode(false);
  };

  const handleDownload = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    console.log('URI :', URI)
    const zip = new JSZip();
    zip.folder('torchql').file("package.json", packagejsonCreator());
    // zip.file("Hello.txt", "Hello World\n");
    zip.folder('torchql').folder('server').file("server.js", serverCreator());
    zip.folder('torchql').folder('server').file("dbConnect.js", dbconnectCreator(URI));
    zip.generateAsync({type:"blob"}).then(function(content:any) {
        FileSaver.saveAs(content, "example.zip");
    });
  };

  return (
    <div className="parent">
      <MainDisplay
        schema={schema}
        URI={URI}
        host={host}
        handleHost={handleHost}
        user={user}
        handleUser={handleUser}
        password={password}
        handlePassword={handlePassword}
        database={database}
        handleDatabase={handleDatabase}
        handleSDLInput={handleSDLInput}
        handleProgInput={handleProgInput}
        handleMySQLInput={handleMySQLSDLInput}
        handleMySQLProgInput={handleMySQLProgInput}
        handleURI={handleURI}
        displayCode={displayCode}
        handleClick={handleClick}
        searchHistory={searchHistory}
        handleDownload={handleDownload}
      />
    </div>
  );
};

export default App;
