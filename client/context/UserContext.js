import React, { createContext, useReducer } from 'react';
import UserReducer from './UserReducer';
export const UserContext = createContext(initialState);

const initialState = {
  uri: '',
  displayCode: false, 
  schema: '',
  host: '',
  user: '',
  password: '', 
  database: ''
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

  function setHost(id) {
    dispatch({
      type: 'ADD_HOST',
      payload: id
    });
  }
  function setUser(id) {
    dispatch({
      type: 'ADD_USER',
      payload: id
    });
  }
  function setPassword(id) {
    dispatch({
      type: 'ADD_PASSWORD',
      payload: id
    });
  }
  function setDatabase(id) {
    dispatch({
      type: 'ADD_DATABASE',
      payload: id
    });
  }
  return (
    <UserContext.Provider value={{
      uri: state.uri,
      displayCode: state.displayCode,
      schema: state.schema,
      host: state.host,
      user: state.user,
      password: state.password,
      database: state.database,
      addURI,
      setDisplayCode,
      setSchema,
      setHost,
      setUser,
      setPassword,
      setDatabase
    }}>
      {props.children}
    </UserContext.Provider>
  );
};
