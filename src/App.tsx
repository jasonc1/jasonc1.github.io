import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Main } from './pages/Main/Main';
import { Photography } from './pages/Photography/Photography';
import UnderConstruction from './pages/UnderConstruction/UnderConstruction.component';
import NotFound from './pages/NotFound/NotFound.component';
import OTM from './pages/Projects/OTM';
import IDSAccordion from './pages/Projects/IDSAccordion';
import DocUploader from './pages/Projects/DocUploader';
import SRLegacy from './pages/Projects/SRLegacy';
import WaitTAskV2 from './pages/Projects/WaitTaskV2';
import AbstractMigrate from './pages/Projects/AbstractMigrate';
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
          <Route path="/IDSAccordion" component={IDSAccordion} />
          <Route path="/DocUploader" component={DocUploader} />
          <Route path="/SRLegacy" component={SRLegacy} />
          <Route path="/404" component={NotFound} />
          <Route path="/WaitTaskV2" component={WaitTAskV2} />
          <Route path="/AbstractMigrate" component={AbstractMigrate} />
          <Redirect from="*" to="/404" />
          {/* <Route path="/dsystemsAtBlend" component={DesignSystemsAtBlend} /> */}
        </Switch>
      </HashRouter>
    </div>
  );
};

export default App;
