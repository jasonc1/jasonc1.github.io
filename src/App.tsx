import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Main } from './pages/Main/Main';
import { Photography } from './pages/Photography/Photography';

export const App = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route path="/photography" component={Photography} />
      </Switch>
    </div>
  );
};

export default App;
