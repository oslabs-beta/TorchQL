import React, { useContext } from 'react';
import InputContainer from '../containers/InputContainer';
import { CodeDisplay } from './CodeDisplay';
const { UserContext } = require("../context/UserContext");

const MainDisplay: React.FC = () => {
  const { displayCode } = useContext(UserContext);

  return (
    <div>
      {!displayCode ? (
           <div className="container">
              <InputContainer />
            </div>
      ) : (
            <div className="container">
              <CodeDisplay />
            </div>
      )}
    </div>
  );
};

export default MainDisplay;
