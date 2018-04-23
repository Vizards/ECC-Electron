// @flow
import React, { Component } from 'react';
import Back from '../components/Back';
import Node from '../components/Node';

import status from '../components/images/Back/status.svg';

type Props = {};

export default class NodePage extends Component<Props> {
  props: Props;

  render() {
    return (
      <div
        style={{ height: '100%', width: '100%' }}
      >
        <Back img={status} />
        <Node />
      </div>
    );
  }
}
