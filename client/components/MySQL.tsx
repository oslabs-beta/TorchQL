import React, { useContext } from 'react';
const { UserContext } = require("../context/UserContext");

export const MySQL: React.FC = () => {
    const { host, user, password, database, setDisplayCode, setHost, setUser, setPassword, setDatabase } = useContext(UserContext);
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
    <div className="input-form">
      <div className="input-button-row">
        <h1 className="header">TorchQL</h1>
        <label htmlFor="uri-input">AUTOMATICALLY GENERATES GRAPHQL SCHEMA AND RESOLVERS</label>
        <div></div>
        <input className="input" name="uri-input" value={host} onChange={(e) => handleHost(e)} placeholder="Enter host"/>
        <input className="input" name="uri-input" value={user} onChange={(e) => handleUser(e)} placeholder="Enter user"/>
        <input className="input" name="uri-input" type="password" value={password} onChange={(e) => handlePassword(e)} placeholder="Enter password"/>
        <input className="input" name="uri-input" value={database} onChange={(e) => handleDatabase(e)} placeholder="Enter database"/>
        <div></div>
        <button
          id="submit-uri"
          className="main-btn"
          onClick={(e) => handleMySQLSDLInput(e)}
        > MySQL SDL Schema
        </button>
        <button
          id="submit-uri"
          className="main-btn"
          onClick={(e) => handleMySQLProgInput(e)}
        > MySQL Programmatic Schema
        </button>
      </div>
    </div>
  );
};
