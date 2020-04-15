import React, { Component } from 'react';
import MainDisplay from './Components/MainDisplay.jsx';
import FileSaver from './Filesaver';

import './styles.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      URI: '',
      schema: [],
      displayCode: false,
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleURI = this.handleURI.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDownloadFile = this.handleDownloadFile.bind(this);
  }

  handleInput(event) {
    event.preventDefault();
    const query = { DB_URI: this.state.URI };
    fetch(`/db/pg?uri=${this.state.URI}`)
      .then((data) => data.json())
      .then((data) => {
        this.setState({ schema: data, displayCode: true });
        console.log('this.state.schema: ', this.state.schema)
      });
    // .catch error??
  }
  handleURI(input) {
    console.log(input);
    this.setState({ URI: input });
  }
  // for CodeDisplay.jsx/Back button
  handleClick(event) {
    event.preventDefault();
    console.log('handleclick working');
    this.setState({ displayCode: false });
  }
  handleDownloadFile(event) {
    event.preventDefault();
    console.log('handleDownloadFile working');
    const text = this.state.schema;
    const blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "GraphQLschema.txt");
  }

  render() {
    return (
      <div className="parent">
        <MainDisplay
          schema={this.state.schema}
          URI={this.state.URI}
          handleInput={this.handleInput}
          handleURI={this.handleURI}
          displayCode={this.state.displayCode}
          handleClick={this.handleClick}
          handleDownloadFile={this.handleDownloadFile}
        />
      </div>
    );
  }
}

export default App;
