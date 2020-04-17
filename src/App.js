import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route} from 'react-router-dom'

import Landing from './views/Landing'
import Dashboard from './views/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Switch>

        <Route exact path="/">
          <Landing />
        </Route>

        <Route exact path="/dashboard">
          <Dashboard />
        </Route>

      </Switch>
    </BrowserRouter>
  );
}

export default App;
