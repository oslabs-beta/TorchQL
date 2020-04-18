import React, { useState } from 'react';
import HistoryContainer from '../containers/HistoryContainer';


const Input = (props) => {
  const [historyOpen, setHistoryOpen] = useState(false);

  const toggleHistory = () => {
    setHistoryOpen(!historyOpen);
  }

  const { searchHistory } = props;

    return (
      <div className="input-form">
        <div className="input-button-row">
          <h1 className="piQL">PiQL 🥒</h1>
          <input
            className="input"
            value={props.URI}
            onChange={(e) => props.handleURI(e.target.value)}
          />
          <button
            id="submit-uri"
            className="main-btn"
            onClick={(e) => props.handleInput(e)}
          >
            Submit
          </button>
          <p
            className="toggle-history-text"
            onClick={() => toggleHistory()}
          >
            View Past Searches
          </p>
          {historyOpen && (
            <HistoryContainer searchHistory={searchHistory} />
          )}
        </div>
      </div>
    );
  }

export default Input;


// class Input extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       historyOpen: false,
//     };
//     this.toggleHistory = this.toggleHistory.bind(this);
//   }

// toggleHistory() {
//   this.setState({ historyOpen: !this.state.historyOpen });
// }



// render() {
//   const { searchHistory } = this.props;
//   return (
//     <div className="input-form">
//       <div className="input-button-row">
//         <h1 className="piQL">PiQL 🥒</h1>
//         <input
//           className="input"
//           value={this.props.URI}
//           onChange={(e) => this.props.handleURI(e.target.value)}
//         />
//         <button
//           id="submit-uri"
//           className="main-btn"
//           onClick={(e) => this.props.handleInput(e)}
//         >
//           Submit
//         </button>
//         <p
//           className="toggle-history-text"
//           onClick={() => this.toggleHistory()}
//         >
//           View Past Searches
//         </p>
//         {this.state.historyOpen && (
//           <HistoryContainer searchHistory={searchHistory} />
//         )}
//       </div>
//     </div>
//   );
// }
// }