import React, { useState } from 'react';
import HistoryContainer from '../containers/HistoryContainer';

interface Props {
  host: string;
  user: string;
  password: string;
  database: string;
  handleMySQLInput: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleHost: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUser: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDatabase: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchHistory: Array<string>;
}

export const MySQL: React.FC<Props> = (props) => {
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);

  const toggleHistory = () => {
    setHistoryOpen(!historyOpen);
  };

  const { 
      searchHistory, 
      handleMySQLInput, 
      handleHost, 
      handleUser, 
      handlePassword, 
      handleDatabase, 
      host,
      user,
      password,
      database
    } = props;

  return (
    <div className="input-form">
      <div className="input-button-row">
        <h1 className="header">TorchQL</h1>
        <label htmlFor="uri-input">MySQL to GraphQL Schema and Resolvers</label>
        <div></div>
        <input className="input" name="uri-input" value={host} onChange={(e) => handleHost(e)} placeholder="Enter Your Host Here"/>
        <input className="input" name="uri-input" value={user} onChange={(e) => handleUser(e)} placeholder="Enter Your User Here"/>
        <input className="input" name="uri-input" type="password" value={password} onChange={(e) => handlePassword(e)} placeholder="Enter Your Password Here"/>
        <input className="input" name="uri-input" value={database} onChange={(e) => handleDatabase(e)} placeholder="Enter Your Relational Database Here"/>
        <div></div>
        <button
          id="submit-uri"
          className="main-btn"
          onClick={(e) => handleMySQLInput(e)}
        >
        MySQL SDL Schema
        </button>
        <p className="toggle-history-text" onClick={() => toggleHistory()}>
          View Past Searches
        </p>
        {historyOpen && <HistoryContainer searchHistory={searchHistory} />}
      </div>
    </div>
  );
};
