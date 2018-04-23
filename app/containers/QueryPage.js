// @flow
import React, { Component } from 'react';
import Back from '../components/Back';
import Query from '../components/Query';

import query from '../components/images/Back/query.svg';

type Props = {};

export default class QueryPage extends Component<Props> {
  props: Props;

  render() {
    return (
      <div
        style={{ height: '100%', width: '100%' }}
      >
        <Back img={query} />
        <Query />
      </div>
    );
  }
}
