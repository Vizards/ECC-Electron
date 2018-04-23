// @flow
import React, { Component } from 'react';
import { RingLoader } from 'react-spinners';
import swal from 'sweetalert';
import styles from './Upload.css';

import select from './images/Upload/group-4.svg';
import button from './images/Upload/group-3.svg';

const { dialog } = require('electron').remote;

type Props = {};

export default class DownloadPage extends Component<Props> {
  props: Props;

  state = {
    text: '',
    password: '',
    loading: false
  };

  handleSelect = async () => {
    const fileArray = await dialog.showOpenDialog({
      title: '选择您要上传的文件',
      openDirectory: false,
      showHiddenFiles: true,
      createDirectory: true,
      promptToCreate: true,
      treatPackageAsDirectory: true,
      multiSelections: false,
    });
    await this.setState({ text: fileArray[0] });
  };

  handleChange = (e) => {
    this.setState({ [e.target.type]: e.target.value });
  };

  handleSubmit = async () => {
    await this.setState({ loading: true });
    const res = await fetch('http://127.0.0.1:49600/api/upload/file', {
      method: 'POST',
      data: this.state,
    });
    const data = await res.json();
    await this.setState({
      loading: false,
      text: '',
      password: ''
    });
    console.log(data);
    if (data.status === 200) {
      await swal({
        text: data.message,
        buttons: false,
        timer: 2000,
      });
    } else {
      await swal({
        text: '发生错误，请重试',
        timer: 2000,
      });
    }
  };

  render() {
    return (
      <div className={styles.upload}>
        <div className={styles.loading} style={{ display: this.state.loading ? 'flex' : 'none' }}>
          <RingLoader
            color="#fff"
            loading={this.state.loading}
          />
        </div>
        <div className={styles.form}>
          <div>
            <input type="text" placeholder="输入文件路径或点击按钮选择文件" value={this.state.text} onChange={this.handleChange} />
            <a onClick={this.handleSelect}><img src={select} alt="select" /></a>
          </div>
          <input type="password" placeholder="输入文件加密密码" value={this.state.password} onChange={this.handleChange} />
        </div>
        <div className={styles.button}>
          <a onClick={this.handleSubmit}><img src={button} alt="upload" /></a>
        </div>
      </div>
    );
  }
}
