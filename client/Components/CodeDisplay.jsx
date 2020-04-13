import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import '../../node_modules/codemirror/mode/javascript/javascript';
import '../../node_modules/codemirror/lib/codemirror.css';
import '../../node_modules/codemirror/theme/darcula.css';

class CodeDisplay extends Component {
  render() {
    return (
      <div>
        <CodeMirror
          value="<h1> codemirror test</h1>"
          options={{
            mode: 'javascript',
            theme: 'darcula',
            lineNumbers: true,
          }}
          onChange={(editor, data, value) => {}}
        />
        <button onClick={(e) => this.props.handleClick(e)}>
            Back
        </button>
      </div>
    );
  }
}

export default CodeDisplay;
