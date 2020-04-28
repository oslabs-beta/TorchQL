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

  const handleURI = (e: React.ChangeEvent<HTMLInputElement>) => {
    setURI(e.target.value);
  };


  // Fetches and returns the SDL Schema
  const handleSDLInput = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (URI !== '') {
      fetch(`/db/pg/sdl?uri=${URI}`)
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

  // Fetches and returns the Programmatic Schema
  const handleProgInput = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (URI !== '') {
      fetch(`/db/pg/prog?uri=${URI}`)
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
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setDisplayCode(false);
  };

  return (
    <div className="parent">
      <MainDisplay
        schema={schema}
        URI={URI}
        handleSDLInput={handleSDLInput}
        handleProgInput={handleProgInput}
        handleURI={handleURI}
        displayCode={displayCode}
        handleClick={handleClick}
        searchHistory={searchHistory}
      />
    </div>
  );
};

export default App;
