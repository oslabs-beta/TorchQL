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
  default:
      return state;
  }
}