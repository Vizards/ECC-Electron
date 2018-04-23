/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import RegisterPage from './containers/RegisterPage';
import MainPage from './containers/MainPage';
import DownloadPage from './containers/DownloadPage';
import UploadPage from './containers/UploadPage';
import NodePage from './containers/NodePage';

export default () => (
  <App>
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/main" component={MainPage} />
      <Route path="/download" component={DownloadPage} />
      <Route path="/upload" component={UploadPage} />
      <Route path="/node" component={NodePage} />
      <Route path="/" exact component={HomePage} />
    </Switch>
  </App>
);
