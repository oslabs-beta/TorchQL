import React, { useContext } from 'react';
const { UserContext } = require('../context/UserContext');
import { Header } from './Header';
const { demoDataCreator } = require("../templateFunctions/demoDataCreator");

export const MySQL: React.FC = () => {
  const {
    host,
    schema,
    user,
    password,
    database,
    addDisplayCode,
    addDisplayStatus,
    addHost,
    addUser,
    addSchema,
    addPassword,
    addDatabase,
  } = useContext(UserContext);
  const demoData = demoDataCreator();
  const handleHost = (e: React.ChangeEvent<HTMLInputElement>) => {
    addHost(e.target.value);
  };
  const handleUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    addUser(e.target.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    addPassword(e.target.value);
  };
  const handleDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    addDatabase(e.target.value);
  };
  const handleMySQLSDLInput = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (host !== '' && user !== '' && password !== '' && database !== '') {
      fetch('/db/mySQL/sdl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, user, password, database }),
      })
        .then((data) => data.json())
        .then((data) => {
          if (data === 'error') {
            addHost('');
            addUser('');
            addPassword('');
            addDatabase('');
          } else {
            addDisplayCode(true);
            addHost('');
            addUser('');
            addPassword('');
            addDatabase('');
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
    if (host !== '' && user !== '' && password !== '' && database !== '') {
      fetch('/db/mySQL/prog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, user, password, database }),
      })
        .then((data) => data.json())
        .then((data) => {
          if (data === 'error') {
            addHost('');
            addUser('');
            addPassword('');
            addDatabase('');
          } else {
            addDisplayCode(true);
            addHost('');
            addUser('');
            addPassword('');
            addDatabase('');
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleSampleInput = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    addSchema(demoData);
    addDisplayCode(true);
    console.log('schema: ', schema);
  }

  return (
    <div className="input-form">
      <button
        className="small-btn"
        onClick={() => {
          addDisplayStatus('postgresql');
        }}
      >
        Use PostgresQL Database
      </button>
      <div className="input-button-row">
        <Header />
        <label htmlFor="uri-input">
          AUTOMATICALLY GENERATES GRAPHQL SCHEMA AND RESOLVERS
        </label>
        <input
          className="input-mysql"
          name="uri-input"
          value={host}
          onChange={(e) => handleHost(e)}
          placeholder="Enter host"
        />
        <input
          className="input-mysql"
          name="uri-input"
          value={user}
          onChange={(e) => handleUser(e)}
          placeholder="Enter user"
        />
        <input
          className="input-mysql"
          name="uri-input"
          type="password"
          value={password}
          onChange={(e) => handlePassword(e)}
          placeholder="Enter password"
        />
        <input
          className="input-mysql"
          name="uri-input"
          value={database}
          onChange={(e) => handleDatabase(e)}
          placeholder="Enter database"
        />
        <div></div>
        <button
          id="submit-uri"
          className="main-btn"
          onClick={(e) => handleSampleInput(e)}
        >
          Demo
        </button>
        <button
          id="submit-uri"
          className="main-btn"
          onClick={(e) => handleMySQLSDLInput(e)}
        >
          {' '}
          SDL Schema
        </button>
        <button
          id="submit-uri"
          className="main-btn"
          onClick={(e) => handleMySQLProgInput(e)}
        >
          {' '}
          Programmatic Schema
        </button>
      </div>
    </div>
  );
};
