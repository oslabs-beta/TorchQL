export default function reducer (state, action) {
  switch(action.type) {
    case "ADD_URI":
      return {
        ...state, uri: action.payload
      };
  default:
      return state;
  }
}