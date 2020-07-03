import React, { useState, useContext } from 'react';
import MainDisplay from './components/MainDisplay';
const { UserContextProvider } = require('./context/UserContext');

import './scss/styles.scss';
import { json } from 'body-parser';

const App: React.FC = () => {
  return (
    <UserContextProvider>
      <div className="parent">
        <MainDisplay />
      </div>
    </UserContextProvider>
  );
};

export default App;
