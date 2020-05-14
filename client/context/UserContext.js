import React, { createContext, useReducer } from 'react';
import UserReducer from './UserReducer';
export const UserContext = createContext(initialState);

const initialState = {
  uri: 'hey'
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

  return (
    <UserContext.Provider value={{
      uri: state.uri,
      addURI
    }}>
      {props.children}
    </UserContext.Provider>
  );
};
