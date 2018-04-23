// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { RingLoader } from 'react-spinners';
import swal from 'sweetalert';
import styles from './Download.css';

import check from './images/Download/group-5.svg';
import download from './images/Download/group-4.svg';
import verify from './images/Download/group-3.svg';

const { clipboard } = require('electron');

type Props = {};

class MyInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      password: '',
    };
  }

  changeText(e) {
    this.setState({
      [e.target.type]: e.target.value,
    }, () => {
      global.DEFAULT_INPUT = { text: this.state.text, password: this.state.password };
    });

    /*
     * This will update the value that the confirm
     * button resolves to:
     */
  }

  render() {
    return (
      <div>
        <input
          value={this.state.text}
          type="text"
          className="swal-content__input"
          placeholder="签发给"
          onChange={this.changeText.bind(this)}
        />
        <input
          value={this.state.password}
          type="password"
          className="swal-content__input"
          placeholder="文件密码"
          onChange={this.changeText.bind(this)}
        />
      </div>
    );
  }
}

// We want to retrieve MyInput as a pure DOM node:
const wrapper = document.createElement('div');
ReactDOM.render(<MyInput />, wrapper);
const el = wrapper.firstChild;

export default class Download extends Component<Props> {
  props: Props;

  state = {
    file: [],
    ticketId: '',
    dir: '',
    loading: false,
  };

  async componentWillMount() {
    const res = await fetch('http://127.0.0.1:49600/api/download/files');
    const data = await res.json();
    this.setState({
      file: data.data,
    });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleVerify = async () => {
    await this.setState({ loading: true });
    const res = await fetch(`http://127.0.0.1:49600/api/download/file?ticketId=${this.state.ticketId}?dir=${this.state.dir}`);
    const data = await res.json();
    await this.setState({ loading: false });
    if (data.status === 200) {
      await swal({
        text: '已下载',
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

  handleDownload = async (fileId) => {
    console.log(fileId);
    const value = await swal({
      text: '请输入文件保存地址',
      content: 'input',
      buttons: {
        cancel: {
          text: '关  闭',
          value: null,
          visible: true,
          className: 'cancelButton',
          closeModal: true,
        },
        confirm: {
          text: '确  定',
          value: true,
          visible: true,
          className: 'confirmButton',
          closeModal: true
        }
      }
    });
    if (value !== null) {
      await this.setState({ loading: true });
      const res = await fetch(`http://127.0.0.1:49600/api/download/file?fileId=${fileId}?dir=${value}`);
      const data = await res.json();
      await this.setState({ loading: false });
      if (data.status === 200) {
        await swal({
          text: '已下载',
          buttons: false,
          timer: 2000,
        });
      } else {
        await swal({
          text: '发生错误，请重试',
          timer: 2000,
        });
      }
    }
  };

  handleCheck = async (item) => {
    const value = await swal({
      text: item.fileName,
      content: el,
      buttons: {
        cancel: {
          text: '关  闭',
          value: null,
          visible: true,
          className: 'cancelButton',
          closeModal: true,
        },
        confirm: {
          text: '确  定',
          value: global.DEFAULT_INPUT,
          visible: true,
          className: 'confirmButton',
          closeModal: true
        }
      }
    });
    await this.setState({ loading: true });
    console.log(value);
    if (value !== null) {
      const res = await fetch('http://127.0.0.1:49600/api/ticket', {
        method: 'POST',
        data: {
          fileId: item.field,
          signFor: value.text,
          password: value.password
        }
      });
      const data = await res.json();
      await this.setState({ loading: false });
      if (data.status === 200) {
        const copy = await swal(data.data, {
          buttons: {
            cancel: {
              text: '复  制',
              value: data.data,
              visible: true,
              className: 'copyButton',
              closeModal: true,
            },
            confirm: {
              text: '关  闭',
              value: null,
              visible: true,
              className: 'confirmButton',
              closeModal: true
            }
          }
        });
        console.log(copy);
        clipboard.writeText(copy);
      }
    }
  };

  render() {
    return (
      <div className={styles.download}>
        <div className={styles.loading} style={{ display: this.state.loading ? 'flex' : 'none' }}>
          <RingLoader
            color="#fff"
            loading={this.state.loading}
          />
        </div>
        <div className={styles.fileList}>
          {this.state.file.map(item => (
            <div key={item.fileId} className={styles.file}>
              <span>{item.fileName}</span>
              <div className={styles.buttons}>
                <a onClick={this.handleCheck.bind(this, item)}><img src={check} alt="check" /></a>
                <a className={styles.lastButton} onClick={this.handleDownload.bind(this, item.fileId)}><img src={download} alt="download" /></a>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.verify}>
          <input type="text" placeholder="输入下载凭证" value={this.state.ticketId} name="ticketId" onChange={this.handleChange} />
          <input type="text" placeholder="输入文件保存路径" value={this.state.dir} name="dir" onChange={this.handleChange} />
          <a onClick={this.handleVerify}><img src={verify} alt="verify" /></a>
        </div>
      </div>
    );
  }
}
