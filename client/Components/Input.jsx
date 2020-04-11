import React, { Component } from 'react';

class Input extends Component {
  render() {
    return (
      <div>
        <button onClick={(e) => this.props.handleInput(e)}>Submit</button>
        <input
          value={this.props.URI}
          onChange={(e) => this.props.handleURI(e.target.value)}
        />
      </div>
    );
  }
}

export default Input;
