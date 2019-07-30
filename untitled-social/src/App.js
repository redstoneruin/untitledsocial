import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {connect} from 'react-redux';

import Home from './components/Home';

import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Route path="/" component={Home} />
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser
  }
}

export default connect(mapStateToProps)(App);
