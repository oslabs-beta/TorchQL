import React, { useState } from 'react';
import HistoryContainer from '../containers/HistoryContainer';

interface Props {
  URI: string;
  handleInput: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleURI: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchHistory: Array<string>;
}

export const Input: React.FC<Props> = (props) => {
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);

  const toggleHistory = () => {
    setHistoryOpen(!historyOpen);
  };

  const { searchHistory, handleInput, handleURI, URI } = props;

  return (
    <div className="input-form">
      <div className="input-button-row">
        <h1 className="piQL">PiQL 🥒</h1>
        <label htmlFor="uri-input">AUTOMATICALLY GENERATES GRAPHQL SCHEMA AND RESOLVERS</label>
        <div></div>
        <input className="input" name="uri-input" value={URI} onChange={(e) => handleURI(e)} placeholder="Enter Your Relational Database URI Here"/>
        <button
          id="submit-uri"
          className="main-btn"
          onClick={(e) => handleInput(e)}
        >
          Submit
        </button>
        <p className="toggle-history-text" onClick={() => toggleHistory()}>
          View Past Searches
        </p>
        {historyOpen && <HistoryContainer searchHistory={searchHistory} />}
      </div>
    </div>
  );
};
