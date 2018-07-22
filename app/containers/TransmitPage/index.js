/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,no-unused-expressions */
// @flow
import React, { Component } from 'react';
import { RingLoader } from 'react-spinners';
import Modal from 'react-modal';
import swal from 'sweetalert';
import styles from './style.css';
import Nav from '../../components/Nav';

import issue from './images/group6.svg';
import download from './images/group8.svg';
import upload from './images/group12.svg';
import check from './images/group13.svg';
import cancel from './images/group-6.svg';
import confirm from './images/group-7.svg';
import select from './images/group_6.svg';
import upload1 from './images/group_8.svg';
import download1 from './images/group_7.svg';
import verify from './images/verify.svg';

const { clipboard } = require('electron');
const { dialog } = require('electron').remote;

const customStyles = {
  overlay: {
    background: 'rgba(255, 255, 255, 0.8)'
  },
  content: {
    width: '465px',
    height: '230px',
    margin: 'auto',
    borderRadius: '8px',
    boxShadow: '0 2px 30px 0 rgba(0, 0, 0, 0.14)',
    background: '#fff',
    border: 'solid 0.5px #d1d1d1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }
};

const customStyles1 = {
  overlay: {
    background: 'rgba(255, 255, 255, 0.8)'
  },
  content: {
    width: '465px',
    margin: 'auto',
    borderRadius: '8px',
    boxShadow: '0 2px 30px 0 rgba(0, 0, 0, 0.14)',
    background: '#fff',
    border: 'solid 0.5px #d1d1d1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }
};


Modal.setAppElement('#root');

type Props = {};

export default class TransmitPage extends Component<Props> {
  props: Props;

  state = {
    fileList: [],
    modalIsOpen: false,
    text: '',
    password: '',
    path: '',
    item: {},
    uploadModalIsOpen: false,
    ticketModalIsOpen: false,
    filePassword: '',
    loading: false,
    status: {},
    ticket: '',
    isClassified: false,
    needEncrypted: false,
  };

  async componentWillMount() {
    const res = await fetch('http://127.0.0.1:33880/electron/file');
    const data = await res.json();
    console.log(data);
    if (data.code === 200) {
      console.log(data);
      this.setState({ fileList: data.data });
    } else if (data.status === 400) {
      await swal({
        text: data.message,
        timer: 2000,
      });
    }
  }

  showModal = async (item) => {
    item.fileId !== undefined ? await this.setState({
      item,
      modalIsOpen: true,
    }) : await this.setState({ uploadModalIsOpen: true });
  };

  showTicketModal = () => {
    this.setState({ ticketModalIsOpen: true });
  };

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
      text: '',
      password: '',
      uploadModalIsOpen: false,
      ticketModalIsOpen: false,
      filePassword: '',
      loading: false,
      status: {},
      ticket: '',
    });
  };

  handleChangeInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChangeChecked = (e) => {
    this.setState({ [e.target.name]: e.target.checked });
  };

  handleCheck = async () => {
    await this.setState({ modalIsOpen: false, text: '', password: '' });
    const res = await fetch(`http://127.0.0.1:33880/electron/ticket?fileId=${this.state.item.fileId}&targetUserId==${this.state.text}&password=${this.state.password}`);
    const data = await res.json();
    console.log(data);
    if (data.code === 200) {
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
      copy !== null && clipboard.writeText(copy);
    } else if (data.status === 400) {
      await swal({
        text: data.message,
        timer: 2000,
      });
    }
  };

  handleCopyFileId = async (item) => {
    await clipboard.writeText(item.fileId);
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
    await this.setState({ path: fileArray[0] });
  };

  handleUpload = async () => {
    await this.setState({ loading: true });
    console.log(this.state);
    const res = await fetch(`http://127.0.0.1:33880/electron/file/upload?needEncrypted=${this.state.needEncrypted}&isClassified=${this.state.isClassified}&secret=${this.state.filePassword}&filePath=${this.state.path}`, {
      method: 'POST'
    });
    const data = await res.json();
    console.log(data);
    await this.setState({ loading: false });
    if (data.code === 200) {
      await this.setState({
        path: '',
        filePassword: ''
      });
      console.log(data);
      await swal({
        text: data.message,
        buttons: false,
        timer: 2000,
      });
    } else {
      await swal({
        text: data.message,
        timer: 2000,
      });
    }
  };

  directDownload = async (item) => {
    const filePath = await dialog.showOpenDialog({
      title: '选择保存的路径',
      buttonLabel: '保存',
      properties: [
        'openDirectory',
        'createDirectory'
      ],
    });
    console.log(filePath);
    if (filePath !== undefined) {
      await this.setState({ loading: true });
      const res = await fetch(`http://127.0.0.1:33880/electron/file/download/id?fileId=${item.fileId}&downloadPath=${filePath[0]}`);
      const data = await res.json();
      await this.setState({ loading: false });
      await swal({
        text: data.message,
        buttons: false,
        timer: 2000,
      });
    }
  };

  handleVerify = async () => {
    await this.setState({ loading: true });
    const res = await fetch('http://127.0.0.1:33880/electron/ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: `"${this.state.ticket}"`
    });
    const data = await res.json();
    await this.setState({ loading: false });
    if (data.code === 200) {
      console.log(data);
      this.setState({ status: data.data });
    } else {
      await swal({
        text: data.message,
        timer: 2000,
      });
    }
  };

  handleDownload = async () => {
    const filePath = await dialog.showOpenDialog({
      title: '选择保存的路径',
      buttonLabel: '保存',
      properties: [
        'openDirectory',
        'createDirectory'
      ],
    });
    if (filePath !== undefined) {
      await this.setState({ loading: true });
      const res = await fetch(`http://127.0.0.1:33880/electron/file/download/ticket?downloadPath=${filePath[0]}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: `"${this.state.ticket}"`
      });
      const data = await res.json();
      await this.setState({ loading: false });
      if (data.code === 200) await this.closeModal();
      await swal({
        text: data.message,
      });
    }
  };

  render() {
    return (
      <div className={styles.TransmitPage}>
        <Nav />
        <div className={styles.loading} style={{ display: this.state.loading ? 'flex' : 'none' }}>
          <RingLoader
            color="#769be5"
            loading={this.state.loading}
          />
        </div>
        <div className={styles.fileList}>
          {this.state.fileList.map(item => (
            <div key={item.fileId} className={styles.file}>
              <div>
                <span>{item.fileName}</span>
                <p>{item.fileId}<a onClick={this.handleCopyFileId.bind(this, item)}>复制</a></p>
              </div>
              <div className={styles.buttons}>
                <img src={issue} alt="签发" onClick={this.showModal.bind(this, item)} />
                <img src={download} alt="下载" className={styles.lastButton} onClick={this.directDownload.bind(this, item)} />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <img src={check} alt="核对凭据" onClick={this.showTicketModal} />
          <img src={upload} alt="上传" onClick={this.showModal} />
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
          style={customStyles}
        >
          <p className={styles.modalFileName}>{this.state.item.fileName}</p>
          <input type="text" name="text" placeholder="签发给" value={this.state.text} onChange={this.handleChangeInput} className={styles.modalInput} />
          <input type="password" name="password" placeholder="文件密码" value={this.state.password} onChange={this.handleChangeInput} className={styles.modalInput} />
          <div className={styles.modalButtons}>
            <img src={cancel} alt="close" onClick={this.closeModal} />
            <img src={confirm} alt="ok" onClick={this.handleCheck} />
          </div>
        </Modal>
        <Modal
          isOpen={this.state.uploadModalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
          style={customStyles}
        >
          <p className={styles.modalFileName}>上传电子政务文件</p>
          <div className={styles.modalSelectFile}>
            <p>{this.state.path === '' ? '请选择文件' : this.state.path}</p>
            <img src={select} alt="select" onClick={this.handleSelect} />
          </div>
          <input type="password" name="filePassword" placeholder="文件密码" value={this.state.filePassword} onChange={this.handleChangeInput} className={styles.modalInput} />
          <div className={styles.modalCheckBox}>
            <input type="checkbox" name="needEncrypted" checked={this.state.needEncrypted} onChange={this.handleChangeChecked} /> <span>加密</span>
            <input type="checkbox" name="isClassified" checked={this.state.isClassified} onChange={this.handleChangeChecked} /> <span>机密文件</span>
          </div>
          <div className={styles.modalButtons}>
            <img src={cancel} alt="close" onClick={this.closeModal} />
            <img src={upload1} alt="upload" onClick={this.handleUpload} />
          </div>
        </Modal>
        <Modal
          isOpen={this.state.ticketModalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
          style={customStyles1}
        >
          <p className={styles.modalFileName}>核对并下载凭据</p>
          <textarea placeholder="输入凭据" name="ticket" value={this.state.ticket} onChange={this.handleChangeInput} className={styles.ticketInput} />
          <div className={styles.modalInfo}>
            <p><span>凭据状态：</span>{this.state.status.isAvailable === undefined ? '请输入凭据后点击验证按钮' : this.state.status.isAvailable ? '有效' : '无效'}</p>
            <p><span>签发者：</span>{this.state.status.owner === undefined ? '请输入凭据后点击验证按钮' : this.state.status.owner}</p>
            <p><span>签发时间：</span>{this.state.status.timestamp === undefined ? '请输入凭据后点击验证按钮' : this.state.status.timestamp}</p>
            <p><span>文件名：</span>{this.state.status.fileName === undefined ? '请输入凭据后点击验证按钮' : this.state.status.fileName}</p>
            <p><span>文件 ID：</span>{this.state.status.fileId === undefined ? '请输入凭据后点击验证按钮' : this.state.status.fileId}</p>
          </div>
          <div className={styles.modalButtons}>
            <img src={cancel} alt="close" onClick={this.closeModal} />
            {!this.state.status.isAvailable ? <img src={verify} alt="verify" onClick={this.handleVerify} /> : <img src={download1} alt="download" onClick={this.handleDownload} />}
          </div>
        </Modal>
      </div>
    );
  }
}
