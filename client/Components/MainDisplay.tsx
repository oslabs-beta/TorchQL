import React from 'react';
import { Input } from './Input';
import { CodeDisplay } from './CodeDisplay';

interface Props {
  displayCode: boolean;
  schema: string;
  URI: string;
  searchHistory: Array<string>;
  handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleSDLInput: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleProgInput: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleMySQLInput: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleURI: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MainDisplay: React.FC<Props> = (props) => {
  return (
    <div>
      {props.displayCode ? ( 
        <div className="container">
          <CodeDisplay schema={props.schema} handleClick={props.handleClick} />
          <Input
            URI={props.URI}
            handleSDLInput={props.handleSDLInput}
            handleProgInput={props.handleProgInput}
            handleMySQLInput={props.handleMySQLInput}
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
            handleMySQLInput={props.handleMySQLInput}
            handleURI={props.handleURI}
            searchHistory={props.searchHistory}
          />
        </div>
      )}
    </div>
  );
};

export default MainDisplay;
