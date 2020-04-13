import React, { Component } from 'react';
import Input from './Input.jsx'
import CodeDisplay from './CodeDisplay.jsx'

class MainDisplay extends Component {
  render() {
      return (
          <div> 
            
            {this.props.displayCode
            ? <div>
            <CodeDisplay schema={this.props.schema}/>
              <Input URI={this.props.URI} 
              handleInput={this.props.handleInput} 
              handleURI={this.props.handleURI} 
              displayCode={this.props.displayCode}
              handleClick={this.props.handleClick}/>
              </div>

            : <div>
            <Input URI={this.props.URI} 
            handleInput={this.props.handleInput} 
            handleURI={this.props.handleURI} 
            displayCode={this.props.displayCode}
            handleClick={this.props.handleClick}/>
            </div>
          }
          </div>
      )
  }
    
}

export default MainDisplay;