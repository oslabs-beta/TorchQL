import React, { useState } from 'react';
import MainDisplay from './components/MainDisplay';

import './styles.scss';

const App: React.FC = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [URI, setURI] = useState<string>('');
  const [schema, setSchema] = useState<string>('');
  const [displayCode, setDisplayCode] = useState<boolean>(false);

  // Add inputted URI to search history
  const addToSearchHistory = () => {
    setSearchHistory([...searchHistory, URI]);
    setURI('');
  };

  const handleURI = (e) => {
    setURI(e.target.value);
  };

  const handleInput = (event) => {
    event.preventDefault();
    if (URI !== '') {
      fetch(`/db/pg?uri=${URI}`)
        .then((data) => data.json())
        .then((data) => {
          addToSearchHistory();
          setSchema(data);
          setDisplayCode(true);
          console.log('schema: ', schema);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  // for CodeDisplay.jsx/Back button
  const handleClick = (event) => {
    event.preventDefault();
    setDisplayCode(false);
  };

  return (
    <div className="parent">
      <MainDisplay
        schema={schema}
        URI={URI}
        handleInput={handleInput}
        handleURI={handleURI}
        displayCode={displayCode}
        handleClick={handleClick}
        searchHistory={searchHistory}
      />
    </div>
  );
};

export default App;
