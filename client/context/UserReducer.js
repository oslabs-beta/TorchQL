export default function reducer (state, action) {
  switch(action.type) {
    case "ADD_URI":
      return {
        ...state, uri: action.payload
      };
    case "ADD_DISPLAYCODE":
      return {
        ...state, displayCode: action.payload
      };
    case "ADD_SCHEMA":
      return {
        ...state, schema: action.payload
      };
    case "ADD_HOST":
      return {
        ...state, host: action.payload
      };
    case "ADD_USER":
      return {
        ...state, user: action.payload
      };
    case "ADD_PASSWORD":
      return {
        ...state, password: action.payload
      };
    case "ADD_DATABASE":
      return {
        ...state, database: action.payload
      };
  default:
      return state;
  }
}