import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import '../../node_modules/codemirror/mode/javascript/javascript';
import '../../node_modules/codemirror/lib/codemirror.css'
import '../../node_modules/codemirror/theme/dracula.css';

class CodeDisplay extends Component {
  render() {
      return(
        <CodeMirror value='<h1> codemirror test</h1>' options={{
            mode: 'xml',
            theme: 'material',
            lineNumbers: true
        }} onChange={(editor, data, value) => {}}/>
      )
  }
}


export default CodeDisplay;

