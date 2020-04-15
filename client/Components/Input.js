import React, { Component } from 'react';
import HistoryContainer from '../containers/HistoryContainer';

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyOpen: false,
    };
    this.toggleHistory = this.toggleHistory.bind(this);
  }

  toggleHistory() {
    this.setState({ historyOpen: !this.state.historyOpen });
  }

  render() {
    const { searchHistory } = this.props;
    return (
      <div className="input-form">
        <div className="input-button-row">
          <h1 className="piQL">PiQL 🥒</h1>
          <input
            className="input"
            value={this.props.URI}
            onChange={(e) => this.props.handleURI(e.target.value)}
          />
          <button
            id="submit-uri"
            className="main-btn"
            onClick={(e) => this.props.handleInput(e)}
          >
            Submit
          </button>
          <p
            className="toggle-history-text"
            onClick={() => this.toggleHistory()}
          >
            View Past Searches
          </p>
          {this.state.historyOpen && (
            <HistoryContainer searchHistory={searchHistory} />
          )}
        </div>
      </div>
    );
  }
}

export default Input;
