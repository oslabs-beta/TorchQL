import React, { useState } from 'react';
import HistoryContainer from '../containers/HistoryContainer';

interface Props {
  URI: string;
  handleSDLInput: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleProgInput: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleURI: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchHistory: Array<string>;
}

export const Input: React.FC<Props> = (props) => {
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);

  const toggleHistory = () => {
    setHistoryOpen(!historyOpen);
  };

  const { searchHistory, handleSDLInput, handleProgInput, handleURI, URI } = props;

  return (
    <div className="input-form">
      <div className="input-button-row">
        <h1 className="header">TorchQL</h1>
        <label htmlFor="uri-input">AUTOMATICALLY GENERATES GRAPHQL SCHEMA AND RESOLVERS</label>
        <div></div>
        <input className="input" name="uri-input" value={URI} onChange={(e) => handleURI(e)} placeholder="Enter Your Relational Database URI Here"/>
        <div></div>
        <button
          id="submit-uri"
          className="main-btn"
          onClick={(e) => handleSDLInput(e)}
        >
          SDL
        </button>
        <button
          id="submit-uri"
          className="main-btn"
          onClick={(e) => handleProgInput(e)}
        >
          Prop
        </button>
        <p className="toggle-history-text" onClick={() => toggleHistory()}>
          View Past Searches
        </p>
        {historyOpen && <HistoryContainer searchHistory={searchHistory} />}
      </div>
    </div>
  );
};
