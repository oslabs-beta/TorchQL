import React, { Component } from 'react';
import MainDisplay from './Components/MainDisplay.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      URI: '',
      schema: [],
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleURI = this.handleURI.bind(this);
  }

  handleInput(event) {
    event.preventDefault();
    const query = { DB_URI: this.state.URI };
    fetch(`http://localhost:3000/db/pg?uri=${this.state.URI}`)
      .then((data) => data.json())
      .then((data) => {
        this.setState({ schema: data });
      });
    // .catch error??
  }
  handleURI(input) {
    console.log(input);
    this.setState({ URI: input });
  }

  render() {
    return (
      <div className="parent">
        <CodeDisplay
          schema={this.state.schema}
          URI={this.state.URI}
          handleInput={this.handleInput}
          handleURI={this.handleURI}
        />
      </div>
    );
  }
}

export default App;
