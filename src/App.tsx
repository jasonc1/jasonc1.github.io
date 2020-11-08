import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Main } from './pages/Main/Main';
import { Photography } from './pages/Photography/Photography';
import UnderConstruction from './pages/UnderConstruction/UnderConstruction.component';

export const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/photography" component={Photography} />
        <Route path="/underconstruction" component={UnderConstruction} />
      </Switch>
    </div>
  );
};

export default App;
