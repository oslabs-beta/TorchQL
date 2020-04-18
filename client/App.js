import React, { useState } from 'react';
import MainDisplay from './components/MainDisplay';

import './styles.scss';

const App = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [URI, setURI] = useState('');
  const [schema, setSchema] = useState('');
  const [displayCode, setDisplayCode] = useState(false);

  // Add inputted URI to search history
  const addToSearchHistory = () => {
    setSearchHistory([...searchHistory, URI]);
    setURI('');
  };

  const handleURI = (input) => {
    setURI(input);
  };

  const handleInput = (event) => {
    event.preventDefault();
    if (URI !== '') {
      fetch(`/db/pg?uri=${URI}`)
        .then((data) => data.json())
        .then((data) => {
          addToSearchHistory();
          setSchema(data);
          setDisplayCode(true);
          console.log('schema: ', schema);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  // for CodeDisplay.jsx/Back button
  const handleClick = (event) => {
    event.preventDefault();
    setDisplayCode(false);
  };
 
  return (
    <div className="parent">
      <MainDisplay
        schema={schema}
        URI={URI}
        handleInput={handleInput}
        handleURI={handleURI}
        displayCode={displayCode}
        handleClick={handleClick}
        searchHistory={searchHistory}
      />
    </div>
  );
};

export default App;


 // class App extends Component {
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //       URI: '',
  //       schema: [],
  //       displayCode: false,
  //       searchHistory: [],
  //     };
  //     this.handleInput = this.handleInput.bind(this);
  //     this.handleURI = this.handleURI.bind(this);
  //     this.handleClick = this.handleClick.bind(this);
  //     this.addToSearchHistory = this.addToSearchHistory.bind(this);
  //   }


 // handleURI(input) {
  //   this.setState({ URI: input });
  // }
  // // for CodeDisplay.jsx/Back button
  // handleClick(event) {
  //   event.preventDefault();
  //   this.setState({ displayCode: false });
  // }
