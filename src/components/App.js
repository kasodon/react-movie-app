import React from 'react';
import { Router } from '@reach/router';

import Header from './elements/Header';
import Home from './Home';
import Movie from './Movie';
import NotFound from './NotFound';

import { GlobalStyle } from './styles/GlobalStyle';

import { Security, ImplicitCallback } from '@okta/okta-react';

const config = {
  issuer: 'https://dev-970896.okta.comDashboard/oauth2/default',
  redirectUri: window.location.origin + '/implicit/callback',
  clientId: '{clientId}',
  pkce: true
}

const App = () => (
  <>
    <Header />
    <Router>
    <Home path="/" />
    <Movie path="/:movieId" />
    <NotFound default />

    </Router>
    
    <GlobalStyle />
  </>
)

export default App;