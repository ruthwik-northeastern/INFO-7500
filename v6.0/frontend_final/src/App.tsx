import React from 'react';
import './App.css';
import Connect from './components/Connect';
import DeployContract from './components/DeployContract';
import AuctionInfo from './components/AuctionInfo';
import Bidding from './components/Bidding';


class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Connect />

        <DeployContract />
       
        <Bidding />

      </div>
    );
  }
}

export default App;