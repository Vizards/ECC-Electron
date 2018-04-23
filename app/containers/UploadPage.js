// @flow
import React, { Component } from 'react';
import Back from '../components/Back';
import Upload from '../components/Upload';

import upload from '../components/images/Back/upload.svg';

type Props = {};

export default class DownloadPage extends Component<Props> {
  props: Props;

  render() {
    return (
      <div
        style={{ height: '100%', width: '100%' }}
      >
        <Back img={upload} />
        <Upload />
      </div>
    );
  }
}
