// @flow
import * as React from 'react';

const ipc = require('electron').ipcRenderer;

ipc.on('got-app-path', (event, path) => {
  global.appPath = path;
});

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {this.props.children}
      </div>
    );
  }
}
