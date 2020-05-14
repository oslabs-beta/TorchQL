import React, { useState, useContext } from 'react';
import MainDisplay from './components/MainDisplay';
const { UserContextProvider } = require("./context/UserContext");

import './styles.scss';
import { json } from 'body-parser';

const App: React.FC = () => {
  // const [searchHistory, setSearchHistory] = useState<string[]>([]);
  // const [URI, setURI] = useState<string>('');

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
  // const addToSearchHistory = () => {
  //   if (searchHistory.length < 3) {
  //     setSearchHistory([...searchHistory, URI]);
  //   } else {
  //       setSearchHistory([...[...searchHistory].splice(1), URI]);
  //     }
  //   setURI('');
  // };


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

            setDisplayCode(true);

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




  return (
    <UserContextProvider>
      <div className="parent">
        <MainDisplay
          host={host}
          handleHost={handleHost}
          user={user}
          handleUser={handleUser}
          password={password}
          handlePassword={handlePassword}
          database={database}
          handleDatabase={handleDatabase}

          handleMySQLInput={handleMySQLSDLInput}
          handleMySQLProgInput={handleMySQLProgInput}

          displayCode={displayCode}
          // searchHistory={searchHistory}
        />
      </div>
    </UserContextProvider>
  );
};

export default App;
