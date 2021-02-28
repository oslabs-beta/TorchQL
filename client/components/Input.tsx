import React, { useState, useContext, useEffect, useRef } from 'react';
// import HistoryContainer from '../containers/HistoryContainer';
const { UserContext } = require('../context/UserContext');
import { Header } from './Header';
const { demoDataCreator } = require("../templateFunctions/demoDataCreator");

export const Input: React.FC = (props) => {
  const uriRef = useRef(null);
  const [URI, setURI] = useState<string>('');
  // const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const {
    addURI,
    schema,
    addDisplayCode,
    addDisplayStatus,
    addSchema,
    // addSearchHistory,
  } = useContext(UserContext);

  const demoData = demoDataCreator();

  useEffect(() => {
    uriRef.current.focus();
  }, []);

  // const toggleHistory = () => {
  //   setHistoryOpen(!historyOpen);
  // };

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
          if (data === 'error') {
            setURI('');
            uriRef.current.focus();
          } else {
            addURI(URI);
            // addSearchHistory(URI);
            setURI('');
            addSchema(data);
            addDisplayCode(true);
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
          if (data === 'error') {
            setURI('');
            uriRef.current.focus();
          } else {
            addURI(URI);
            // addSearchHistory(URI);
            setURI('');
            addSchema(data);
            addDisplayCode(true);
            console.log('schema: ', schema);
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
          addDisplayStatus('mysql');
        }}
      >
        Use MySQL Database
      </button>
      <div className="input-button-row">
        <Header />
        <label htmlFor="uri-input">
          AUTOMATICALLY GENERATES GRAPHQL SCHEMA AND RESOLVERS
        </label>
        <input
          type="text"
          ref={uriRef}
          className="input"
          name="uri-input"
          value={URI}
          onChange={(e) => handleURI(e)}
          placeholder="Enter Your PostgreSQL Database URI Here"
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
        {/* <p className="toggle-history-text" onClick={() => toggleHistory()}>
          {historyOpen ? <p>Hide Past Searches</p> : <p>View Past Searches</p>}
        </p>
        {historyOpen && <HistoryContainer />} */}
      </div>
    </div>
  );
};
