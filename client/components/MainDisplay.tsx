import React, { useState, useContext } from 'react';
import { Input } from './Input';
import { CodeDisplay } from './CodeDisplay';
import { MySQL } from './MySQL';
const { UserContext } = require("../context/UserContext");

const MainDisplay: React.FC = (props) => {
  const { displayCode } = useContext(UserContext);
  const [displayStatus, setDisplayStatus] = useState<string>('postgresql');
  return (
    <div>
      <button
        className="main-btn"
        onClick={() => {
          setDisplayStatus('postgresql');
        }}
      >
        PostgreSQL
      </button>
      <button
        className="main-btn"
        onClick={() => {
          setDisplayStatus('mysql');
        }}
      >
        MySQL
      </button>
      {displayStatus === 'postgresql' && (
        <div className="container">
          {displayCode ? (
            <div className="container">
              <CodeDisplay />
              <Input />
            </div>
          ) : (
            <div className="container">
              <Input />
            </div>
          )}
        </div>
      )}
      {displayStatus === 'mysql' && (
        <div className="container">
          {displayCode ? (
            <div className="container">
              <CodeDisplay />
              <MySQL />
            </div>
          ) : (
            <div className="container">
              <MySQL />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MainDisplay;
