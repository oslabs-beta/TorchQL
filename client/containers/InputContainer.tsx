import React, { useContext } from 'react'
import { Input } from '../components/Input';
import { MySQL } from '../components/MySQL';
const { UserContext } = require("../context/UserContext");

const InputContainer: React.FC = () => {
  const { displayStatus } = useContext(UserContext);

  return (
    <div>
      {displayStatus === 'postgresql' && (
        <div className="container">
          <Input />
        </div>
      )}
      {displayStatus === 'mysql' && (
        <div className="container">
          <MySQL />
        </div>
      )}
    </div>
  )
}

export default InputContainer
