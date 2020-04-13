import React, { Component } from 'react';
import Input from './Input.jsx';
import CodeDisplay from './CodeDisplay.jsx';

class MainDisplay extends Component {
  render() {
    return (
      <div>
        {this.props.displayCode ? (
          <div>
            <CodeDisplay
              schema={this.props.schema}
              handleClick={this.props.handleClick}
            />
            <Input
              URI={this.props.URI}
              handleInput={this.props.handleInput}
              handleURI={this.props.handleURI}
              displayCode={this.props.displayCode}
            />
          </div>
        ) : (
          <div>
            <Input
              URI={this.props.URI}
              handleInput={this.props.handleInput}
              handleURI={this.props.handleURI}
              displayCode={this.props.displayCode}
            />
          </div>
        )}
      </div>
    );
  }
}

export default MainDisplay;
