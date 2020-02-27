import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';


import Header from './elements/Header';
import Home from './Home';
import Movie from './Movie';
import NotFound from './NotFound';
import Login from './auth/login';

import { GlobalStyle } from './styles/GlobalStyle';

function onAuthRequired({ history }) {
  history.push('/login');
}


class App extends Component {
  render() {
    return (
    <Router>
      <Header />
      <Security
         issuer="https://dev-970896.okta.com/oauth2/default"
         client_id="0oa2ikdw76Uo1oLMn4x6"
         redirect_uri={window.location.origin + '/implicit/callback'}
         onAuthRequired={onAuthRequired}
      >
              <Route path="/" exact={true} component={Home} />
              <SecureRoute path="/:movieId" exact={true} component={Movie} />
              <Route
                path="/login"
                render={() => (
                  <Login baseUrl="https://dev-970896.okta.com" />
                )}
              />
              <Route path="/implicit/callback" component={ImplicitCallback} />
              <Route default component={NotFound} />
     
      </Security>
      <GlobalStyle />     
    </Router>
    );
  }
}


export default App;