import React from 'react';
import Input from './Input';
import CodeDisplay from './CodeDisplay';

const MainDisplay = (props) => {
  return (
    <div>
      {props.displayCode ? (
        <div className="container">
          <CodeDisplay schema={props.schema} handleClick={props.handleClick} />
          <Input
            URI={props.URI}
            handleInput={props.handleInput}
            handleURI={props.handleURI}
            displayCode={props.displayCode}
            searchHistory={props.searchHistory}
          />
        </div>
      ) : (
        <div className="container">
          <Input
            URI={props.URI}
            handleInput={props.handleInput}
            handleURI={props.handleURI}
            displayCode={props.displayCode}
            searchHistory={props.searchHistory}
          />
        </div>
      )}
    </div>
  );
};

export default MainDisplay;
