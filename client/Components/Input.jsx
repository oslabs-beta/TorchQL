import React, { Component } from 'react';
// import '../styles.scss';

class Input extends Component {
  render() {
    return (
      <div className="form">
        <h1 className="piQL">PiQL 🥒</h1>
        <input
          className="input"
          value={this.props.URI}
          onChange={(e) => this.props.handleURI(e.target.value)}
        />
        <button
          id="submit-uri"
          className="MainBtn"
          onClick={(e) => this.props.handleInput(e)}
        >
          Submit
        </button>
      </div>
    );
  }
}

export default Input;
