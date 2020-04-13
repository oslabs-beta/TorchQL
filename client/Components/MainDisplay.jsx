import React, { Component } from 'react';
import Input from './Input.jsx'
// import CodeMirror from './CodeDisplay.jsx'

class MainDisplay extends Component {
  render() {
      return (
          <div>
            {/* <CodeMirror schema={this.props.schema}/> */}
              
            <Input URI={this.props.URI} handleInput={this.props.handleInput} handleURI={this.props.handleURI}/>
          </div>
      )
  }
    
}

export default MainDisplay;