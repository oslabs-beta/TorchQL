import React from 'react';


interface Props {
  host: string;
  user: string;
  password: string;
  database: string;
  handleMySQLInput: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleMySQLProgInput: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleHost: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUser: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDatabase: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // searchHistory: Array<string>;
}

export const MySQL: React.FC<Props> = (props) => {

  const { 
      handleMySQLInput, 
      handleMySQLProgInput, 
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
          onClick={(e) => handleMySQLInput(e)}
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
