import React from 'react';
import { Input } from './Input';
import { CodeDisplay } from './CodeDisplay';
import { MySQL } from './MySQL';

interface Props {
  displayCode: boolean;
  displayInput: boolean;
  displayMySQL: boolean;
  schema: string;
  URI: string;
  host: string;
  user: string;
  password: string;
  database: string;
  searchHistory: Array<string>;
  handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleSDLInput: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleProgInput: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleMySQLInput: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleURI: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleHost: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUser: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDatabase: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputToggle: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  mySQLToggle: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}


const MainDisplay: React.FC<Props> = (props) => {
  return (
    <div>
      <button className="main-btn" onClick={props.inputToggle} >PostgresSQL</button>
      {props.displayInput &&
        <div className="container">
          {props.displayCode ? (
            <div className="container">
              <CodeDisplay schema={props.schema} handleClick={props.handleClick} />
              <Input
              URI={props.URI}
              handleSDLInput={props.handleSDLInput}
              handleProgInput={props.handleProgInput}
              handleURI={props.handleURI}
              searchHistory={props.searchHistory}
              />
            </div>
          ) : (
            <div className="container">
              <Input
                URI={props.URI}
                handleSDLInput={props.handleSDLInput}
                handleProgInput={props.handleProgInput}
                handleURI={props.handleURI}
                searchHistory={props.searchHistory}
              />
            </div>
          )}
        </div>
      }
      <button className="main-btn" onClick={props.mySQLToggle} >MySQL</button>
      {props.displayMySQL && 
        <div className="container">
          {props.displayCode ? (
            <div className="container">
              <CodeDisplay schema={props.schema} handleClick={props.handleClick} />
              <MySQL
                host={props.host}
                user={props.user}
                password={props.password}
                database={props.database}
                handleHost={props.handleHost}
                handleUser={props.handleUser}
                handlePassword={props.handlePassword}
                handleDatabase={props.handleDatabase}
                handleMySQLInput={props.handleMySQLInput}
                searchHistory={props.searchHistory}
              />
            </div>
          ) : (
            <div className="container">
              <MySQL
                host={props.host}
                user={props.user}
                password={props.password}
                database={props.database}
                handleHost={props.handleHost}
                handleUser={props.handleUser}
                handlePassword={props.handlePassword}
                handleDatabase={props.handleDatabase}
                handleMySQLInput={props.handleMySQLInput}
                searchHistory={props.searchHistory}
                />
            </div>
          )}
        </div>
      }
    </div>
  );
};

export default MainDisplay;

