/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage/index';
import NodePage from './containers/NodePage/index';
import AuditPage from './containers/AuditPage/index';
import HumanPage from './containers/HumanPage/index';
import QueryPage from './containers/QueryPage/index';
import TransmitPage from './containers/TransmitPage/index';

export default () => (
  <App>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/node" component={NodePage} />
      <Route path="/audit" component={AuditPage} />
      <Route path="/human" component={HumanPage} />
      <Route path="/query" component={QueryPage} />
      <Route path="/transmit" component={TransmitPage} />
    </Switch>
  </App>
);
