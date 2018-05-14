/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// @flow
import React, { Component } from 'react';
import styles from './style.css';
import Nav from '../../components/Nav';

import issue from './images/group6.svg';
import download from './images/group8.svg';
import upload from './images/group12.svg';
import check from './images/group13.svg';

type Props = {};

export default class TransmitPage extends Component<Props> {
  props: Props;

  state = {
    fileList: [],
  };

  async componentWillMount() {
    const res = await fetch('http://127.0.0.1:49600/api/transfer');
    const data = await res.json();
    if (data.status === 200) {
      console.log(data);
      this.setState({ fileList: data.data });
    }
  }

  render() {
    return (
      <div className={styles.TransmitPage}>
        <Nav />
        <div className={styles.fileList}>
          {this.state.fileList.map(item => (
            <div key={item.fileId} className={styles.file}>
              <span>{item.fileName}</span>
              <div className={styles.buttons}>
                <img src={issue} alt="签发" />
                <img src={download} alt="下载" className={styles.lastButton} />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <img src={check} alt="核对凭据" />
          <img src={upload} alt="上传" />
        </div>
      </div>
    );
  }
}
