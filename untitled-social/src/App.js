import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {connect} from 'react-redux';

import Home from './components/Home';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import SocialNavbar from './components/navigation/SocialNavbar';
import Profile from './components/profile/Profile';
import Feed from './components/feed/Feed';
import Post from './components/posts/Post';
import Topic from './components/posts/Topic';

import './styles/App.css';

/**
 * Main App component, contains navbar and wraps all components
 */
class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <div className="navbar">
            <SocialNavbar />
          </div>
          <Switch>
            <Route path="/login" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/feed" component={Feed} />
            <Route path="/user/:id" component={Profile} />
            <Route path="/post/:id" component={Post} />
            <Route path="/topic/:id" component={Topic} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser
  }
}

export default connect(mapStateToProps)(App);
