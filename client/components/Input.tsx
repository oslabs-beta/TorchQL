import React, { useState, useContext } from 'react';
import HistoryContainer from '../containers/HistoryContainer';
const { UserContext } = require("../context/UserContext");

export const Input: React.FC = (props) => {
  const [URI, setURI] = useState<string>('');
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const { uri, addURI, schema, displayCode, setDisplayCode, setSchema, addSearchHistory } = useContext(UserContext);

  const toggleHistory = () => {
    setHistoryOpen(!historyOpen);
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
              addURI(URI);
              addSearchHistory(URI);
              setURI('');
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
    if (uri !== '') {
      fetch(`/db/pg/prog?uri=${uri}`)
        .then((data) => data.json())
        .then((data) => {
          if (data === "error") {
            addURI('');
          } else {
              addSearchHistory(uri);
              addURI('');
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

  return (
    <div className="input-form">
      <div className="input-button-row">
        <h1 className="header"><img className="logo" src="https://i.ibb.co/SdWYTxq/torchql.png" />TorchQL<img className="logo" src="https://i.ibb.co/SdWYTxq/torchql.png" /></h1>
        <label htmlFor="uri-input">AUTOMATICALLY GENERATES GRAPHQL SCHEMA AND RESOLVERS</label>
        <div></div>
        <input type='text' autoFocus className="input" name="uri-input" value={URI} onChange={(e) => handleURI(e)} placeholder="Enter Your PostgreSQL Database URI Here"/>
        <div></div>
        <button
          id="submit-uri"
          className="main-btn"
          onClick={(e) => handleSDLInput(e)}
        >
        SDL Schema
        </button>
        <button
          id="submit-uri"
          className="main-btn"
          onClick={(e) => handleProgInput(e)}
        >
        Programmatic Schema
        </button>
        <p className="toggle-history-text" onClick={() => toggleHistory()}>
        {historyOpen ? <p>Hide Past Searches</p>:<p>View Past Searches</p>}
        </p>
        {historyOpen && <HistoryContainer />}
      </div>
    </div>
  );
};
