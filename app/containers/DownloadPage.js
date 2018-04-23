// @flow
import React, { Component } from 'react';
import Back from '../components/Back';
import Download from '../components/Download';

import download from '../components/images/Back/download.svg';

type Props = {};

export default class DownloadPage extends Component<Props> {
  props: Props;

  render() {
    return (
      <div
        style={{ height: '100%', width: '100%' }}
      >
        <Back img={download} />
        <Download />
      </div>
    );
  }
}
