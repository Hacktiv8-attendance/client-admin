import React from 'react';
import { Switch, Route } from 'react-router-dom'

import GuardedRoutes from './views/GuardedRoutes.js'
import Landing from './views/Landing'
import NotFound from './views/NotFound'

function App() {

  return (
    <Switch>
      <Route exact path="/" component={Landing} />
      <GuardedRoutes />
      <Route path="*" component={NotFound} />
    </Switch>
  );

}

export default App;
