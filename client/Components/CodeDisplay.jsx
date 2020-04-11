import React, { Component } from 'react';
import Input from '../Components/Input.jsx'

class CodeDisplay extends Component {
  render() {
      return (
          <div>
              <div className='schema'>
                  {this.props.schema}
              </div>
              <Input URI={this.props.URI} handleInput={this.props.handleInput} handleURI={this.props.handleURI}/>
          </div>
      )
  }
    
}

export default CodeDisplay;