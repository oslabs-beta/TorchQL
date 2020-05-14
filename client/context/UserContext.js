import React, { createContext, useReducer } from 'react';
import UserReducer from './UserReducer';
export const UserContext = createContext(initialState);

const initialState = {
  uri: 'hey',
  displayCode: false, 
  schema: ''
}

export const UserContextProvider = props => {
  const [state, dispatch] = useReducer(UserReducer, initialState);

  // Actions
  function addURI(id) {
    dispatch({
      type: 'ADD_URI',
      payload: id
    });
  }

  function setDisplayCode(id) {
    dispatch({
      type: 'ADD_DISPLAYCODE',
      payload: id
    });
  }

  function setSchema(id) {
    dispatch({
      type: 'ADD_SCHEMA',
      payload: id
    });
  }
  return (
    <UserContext.Provider value={{
      uri: state.uri,
      displayCode: state.displayCode,
      schema: state.schema,
      addURI,
      setDisplayCode,
      setSchema
    }}>
      {props.children}
    </UserContext.Provider>
  );
};
