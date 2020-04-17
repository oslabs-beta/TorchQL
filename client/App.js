import React, { useState } from 'react';
import MainDisplay from './components/MainDisplay';


import './styles.scss';



const App = () => {
   const [searchHistory, setSearchHistory] = useState([]);
  const [URI, setURI] = useState('');


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

  // Add inputted URI to search history
  const addToSearchHistory = () => {
    setSearchHistory([...searchHistory, URI]);
    setURI('');
  }

  // handleInput(event) {
  //   event.preventDefault();
  //   if (this.state.URI !== '') {
  //     fetch(`/db/pg?uri=${this.state.URI}`)
  //       .then((data) => data.json())
  //       .then((data) => {
  //         this.addToSearchHistory();
  //         this.setState({ schema: data, displayCode: true });
  //         console.log('this.state.schema: ', this.state.schema);
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   }
  // }
  // handleURI(input) {
  //   this.setState({ URI: input });
  // }
  // // for CodeDisplay.jsx/Back button
  // handleClick(event) {
  //   event.preventDefault();
  //   this.setState({ displayCode: false });
  // }
    return (
      <div className="parent">
        <MainDisplay
          schema={this.state.schema}
          URI={this.state.URI}
          handleInput={this.handleInput}
          handleURI={this.handleURI}
          displayCode={this.state.displayCode}
          handleClick={this.handleClick}
          searchHistory={searchHistory}
        />
      </div>
    );
  }

export default App;
