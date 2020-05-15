import React, { useState, useContext } from 'react';
import MainDisplay from './components/MainDisplay';
const { UserContextProvider } = require("./context/UserContext");

import './styles.scss';
import { json } from 'body-parser';

const App: React.FC = () => {
 
  // Add inputted URI to search history
  // const addToSearchHistory = () => {
  //   if (searchHistory.length < 3) {
  //     setSearchHistory([...searchHistory, URI]);
  //   } else {
  //       setSearchHistory([...[...searchHistory].splice(1), URI]);
  //     }
  //   setURI('');
  // };

  return (
    <UserContextProvider>
      <div className="parent">
        <MainDisplay />
      </div>
    </UserContextProvider>
  );
};

export default App;
