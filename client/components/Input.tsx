import React, { useState, useContext, useEffect, useRef } from 'react';
import HistoryContainer from '../containers/HistoryContainer';
const { UserContext } = require("../context/UserContext");
import {useSpring, animated} from 'react-spring'

export const Input: React.FC = (props) => {
  const uriRef = useRef(null);
  const fade = useSpring({opacity: 1, from: {opacity: 0}})
  const [URI, setURI] = useState<string>('');
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const { uri, addURI, schema, displayCode, addDisplayCode, addSchema, addSearchHistory } = useContext(UserContext);

  useEffect(()=>{
    uriRef.current.focus();
  }, []);

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
            uriRef.current.focus();
          } else {
              addURI(URI);
              addSearchHistory(URI);
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
        if (data === "error") {
          setURI('');
          uriRef.current.focus();
        } else {
            addURI(URI);
            addSearchHistory(URI);
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

  return (
    <div className="input-form">
      <div className="input-button-row">
        <animated.div style={fade}>
          <h1 className="header"><img className="logo" src="https://i.ibb.co/SdWYTxq/torchql.png" />TorchQL<img className="logo" src="https://i.ibb.co/SdWYTxq/torchql.png" /></h1>
        </animated.div>
        <label htmlFor="uri-input">AUTOMATICALLY GENERATES GRAPHQL SCHEMA AND RESOLVERS</label>
        <div></div>
        <input 
          type='text'
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
