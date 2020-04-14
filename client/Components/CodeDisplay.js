import React, { Component } from 'react';
import { UnControlled as CodeMirror } from '../../node_modules/react-codemirror2';
import '../../node_modules/codemirror/mode/javascript/javascript';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../node_modules/codemirror/theme/dracula.css';

class CodeDisplay extends Component {
  render() {
    return (
      <div id="codemirror-div">
        <CodeMirror
          className="codemirror"
          value={this.props.schema}
          options={{
            mode: 'javascript',
            theme: 'dracula',
            lineNumbers: true,
            lineWrapping: true,
          }}
          onChange={(editor, data, value) => {}}
        />
        <button className="MainBtn" onClick={(e) => this.props.handleClick(e)}>
          Back
        </button>
      </div>
    );
  }
}

export default CodeDisplay;
