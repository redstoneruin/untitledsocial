import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import Home from './components/Home';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route path="/" component={Home} />
      </BrowserRouter>
    </div>
  );
}

export default App;
