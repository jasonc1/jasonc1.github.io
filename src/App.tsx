import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Main } from './pages/Main/Main';
import { Photography } from './pages/Photography/Photography';
import UnderConstruction from './pages/UnderConstruction/UnderConstruction.component';
import OTM from './pages/Projects/OTM';
// import DesignSystemsAtBlend from './pages/Blog/designSystemsAtBlend';

export const App = () => {
  return (
    <div>
      <HashRouter>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/photography" component={Photography} />
          <Route path="/underconstruction" component={UnderConstruction} />
          <Route path="/OTM" component={OTM} />
          {/* <Route path="/dsystemsAtBlend" component={DesignSystemsAtBlend} /> */}
        </Switch>
      </HashRouter>
    </div>
  );
};

export default App;
