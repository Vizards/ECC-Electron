// @flow
import React, { Component } from 'react';
import Menu from '../components/Menu';
import Exit from '../components/Exit';

type Props = {};

export default class MainPage extends Component<Props> {
  props: Props;

  render() {
    return (
      <div
        style={{ height: '100%', width: '100%' }}
      >
        <Exit />
        <Menu />
      </div>
    );
  }
}
