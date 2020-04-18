import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import GuardedRoutes from './views/GuardedRoutes.js'
import Landing from './views/Landing'
import NotFound from './views/NotFound'

function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <GuardedRoutes />
        <Route path="*" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );

}

export default App;
