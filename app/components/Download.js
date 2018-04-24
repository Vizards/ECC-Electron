// @flow
import React, { Component } from 'react';
import { RingLoader } from 'react-spinners';
import Modal from 'react-modal';
import swal from 'sweetalert';
import styles from './Download.css';

import check from './images/Download/group-5.svg';
import download from './images/Download/group-4.svg';
import verify from './images/Download/group-3.svg';
import cancel from './images/Download/group.svg';
import confirm from './images/Download/confirm.svg';

const { clipboard } = require('electron');

const customStyles = {
  overlay: {
    background: '#101628'
  },
  content: {
    width: '70%',
    height: '50%',
    margin: 'auto',
    borderRadius: '8px',
    background: '#223159',
    border: '0 none',
    textAlign: 'center',
  }
};

Modal.setAppElement('#root');

type Props = {};

export default class Download extends Component<Props> {
  props: Props;

  state = {
    file: [],
    ticketId: '',
    dir: '',
    loading: false,
    modalIsOpen: false,
    item: {},
    text: '',
    password: '',
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

  handleChangeInput = (e) => {
    this.setState({ [e.target.type]: e.target.value });
  };

  showModal = async (item) => {
    console.log(item);
    await this.setState({
      item,
      modalIsOpen: true,
    });
  };

  handleCheck = async () => {
    await this.setState({ loading: true, modalIsOpen: false });
    const res = await fetch('http://127.0.0.1:49600/api/ticket', {
      method: 'POST',
      data: {
        fileId: this.state.item.field,
        signFor: this.state.text,
        password: this.state.password
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
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
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
                <a onClick={this.showModal.bind(this, item)}><img src={check} alt="check" /></a>
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
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
          style={customStyles}
        >
          <p className={styles.fileName}>{this.state.item.fileName}</p>
          <input type="text" placeholder="签发给" value={this.state.text} onChange={this.handleChangeInput} className={styles.input} />
          <input type="password" placeholder="文件密码" value={this.state.password} onChange={this.handleChangeInput} className={styles.input} />
          <div className={styles.modalButton}>
            <a onClick={this.closeModal}><img src={cancel} alt="close" /></a>
            <a onClick={this.handleCheck}><img src={confirm} alt="ok" /></a>
          </div>
        </Modal>
      </div>
    );
  }
}
