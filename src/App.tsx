import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Main } from './pages/Main/Main';
import { Photography } from './pages/Photography/Photography';
import UnderConstruction from './pages/UnderConstruction/UnderConstruction.component';
import NotFound from './pages/NotFound/NotFound.component';
import OTM from './pages/Projects/OTM';
import IDSAccordion from './pages/Projects/IDSAccordion';
import DocUploader from './pages/Projects/old/DocUploader';
import SRLegacy from './pages/Projects/old/SRLegacy';
import WaitTAskV2 from './pages/Projects/WaitTaskV2';
import AbstractMigrate from './pages/Projects/AbstractMigrate';
import Sapling from './pages/Projects/Sapling';
import Haven from './pages/Projects/Haven';
import DesignSystemsAtBlend from './pages/Blog/DesignSystemsAtBlend';
import PrototypingAtBlend from './pages/Blog/PrototypingAtBlend';
import StratRoulette from './pages/Projects/old/StratRoulette';
import Alchemy from './pages/Projects/Alchemy';
import ExerciseStatus from './pages/Projects/ExerciseStatus';
import EmployeeOnboarding from './pages/Projects/EmployeeOnboarding';
import Vesta from './pages/Projects/Vesta';
import Ink from './pages/Projects/Ink';

import ProductIllustrations from './pages/Projects/old/ProductIllustrations';

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
          <Route path="/Sapling" component={Sapling} />
          <Route path="/Haven" component={Haven} />
          <Route path="/StratRoulette" component={StratRoulette} />
          <Route path="/Alchemy" component={Alchemy} />
          <Route path="/ExerciseStatus" component={ExerciseStatus} />
          <Route path="/EmployeeOnboarding" component={EmployeeOnboarding} />
          <Route path="/Ink" component={Ink} />
          <Route path="/Vesta" component={Vesta} />

          <Route
            path="/ProductIllustrations"
            component={ProductIllustrations}
          />

          <Route
            path="/DesignSystemsAtBlend"
            component={DesignSystemsAtBlend}
          />
          <Route path="/PrototypingAtBlend" component={PrototypingAtBlend} />
          <Redirect from="*" to="/404" />
          {/* <Route path="/dsystemsAtBlend" component={DesignSystemsAtBlend} /> */}
        </Switch>
      </HashRouter>
    </div>
  );
};

export default App;
