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
  database: '',
  searchHistory: []
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

  function addDisplayCode(id) {
    dispatch({
      type: 'ADD_DISPLAYCODE',
      payload: id
    });
  }

  function addSchema(id) {
    dispatch({
      type: 'ADD_SCHEMA',
      payload: id
    });
  }

  function addHost(id) {
    dispatch({
      type: 'ADD_HOST',
      payload: id
    });
  }
  function addUser(id) {
    dispatch({
      type: 'ADD_USER',
      payload: id
    });
  }
  function addPassword(id) {
    dispatch({
      type: 'ADD_PASSWORD',
      payload: id
    });
  }
  function addDatabase(id) {
    dispatch({
      type: 'ADD_DATABASE',
      payload: id
    });
  }
  function addSearchHistory(id) {
    dispatch({
      type: 'ADD_SEARCHHISTORY',
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
      searchHistory: state.searchHistory,
      addURI,
      addDisplayCode,
      addSchema,
      addHost,
      addUser,
      addPassword,
      addDatabase,
      addSearchHistory
    }}>
      {props.children}
    </UserContext.Provider>
  );
};
