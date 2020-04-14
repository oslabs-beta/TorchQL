import React, { Component } from 'react';
import Input from './Input';
import CodeDisplay from './CodeDisplay';

class MainDisplay extends Component {
  render() {
    return (
      <div>
        {this.props.displayCode ? (
          <div className="container">
            <CodeDisplay
              schema={this.props.schema}
              handleClick={this.props.handleClick}
            />
            <Input
              URI={this.props.URI}
              handleInput={this.props.handleInput}
              handleURI={this.props.handleURI}
              displayCode={this.props.displayCode}
              searchHistory={this.props.searchHistory}
            />
          </div>
        ) : (
          <div className="container">
            <Input
              URI={this.props.URI}
              handleInput={this.props.handleInput}
              handleURI={this.props.handleURI}
              displayCode={this.props.displayCode}
              searchHistory={this.props.searchHistory}
            />
          </div>
        )}
      </div>
    );
  }
}

export default MainDisplay;
