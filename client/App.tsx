import React, { useState } from 'react';
import MainDisplay from './components/MainDisplay';

import './styles.scss';
import { json } from 'body-parser';

const App: React.FC = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [URI, setURI] = useState<string>('');
  const [schema, setSchema] = useState<string>('');
  const [displayCode, setDisplayCode] = useState<boolean>(false);
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [displayMySQL, setDisplayMySQL] = useState<boolean>(false);

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
    setSearchHistory([...searchHistory, URI]);
    setURI('');
  };

  // Toggle logic to display Postgres or MySQL
  const inputToggle = () => setDisplayInput(!displayInput)
  const mySQLToggle = () => setDisplayMySQL(!displayMySQL)

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
          addToSearchHistory();
          setSchema(data);
          setDisplayCode(true);
          console.log('schema: ', schema);
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
          addToSearchHistory();
          setSchema(data);
          setDisplayCode(true);
          console.log('schema: ', schema);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  // Handles and fetches the MySQL SDL Schema
  // TODO change fetch to post request intead
  const handleMySQLInput = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (URI !== '') {
      fetch(`/db/mySQL}`, {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({ host, user, password, database })
      })
      .then((data) => data.json())
      .then((data) => {
        setSchema(data),
        setDisplayCode(true);
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
        handleMySQLInput={handleMySQLInput}
        handleURI={handleURI}
        displayCode={displayCode}
        displayInput={displayInput}
        displayMySQL={displayMySQL}
        handleClick={handleClick}
        inputToggle={inputToggle}
        mySQLToggle={mySQLToggle}
        searchHistory={searchHistory}
      />
    </div>
  );
};

export default App;
