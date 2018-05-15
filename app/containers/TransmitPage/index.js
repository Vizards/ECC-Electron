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
  };

  async componentWillMount() {
    const res = await fetch('http://hins.work:49600/api/transfer');
    const data = await res.json();
    if (data.status === 200) {
      console.log(data);
      this.setState({ fileList: data.data });
    }
  }

  showModal = async (item) => {
    console.log(item);
    item.field !== undefined ? await this.setState({
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

  handleCheck = async () => {
    await this.setState({ modalIsOpen: false, text: '', password: '' });
    const res = await fetch(`http://hins.work:49600/api/transfer/ticket/sign?fileId=${this.state.item.fileId}&signFor=${this.state.text}&password=${this.state.password}`);
    const data = await res.json();
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
      copy !== null && clipboard.writeText(copy);
    }
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
    const res = await fetch('http://hins.work:49600/api/transfer/upload', {
      method: 'POST',
      data: {
        dir: this.state.path,
        password: this.state.filePassword
      },
    });
    const data = await res.json();
    await this.setState({ loading: false });
    if (data.status === 200) {
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
        text: '发生错误，请重试',
        timer: 2000,
      });
    }
  };

  directDownload = async (item) => {
    await this.setState({ loading: true });
    const res = await fetch(`http://hins.work:49600/api/transfer/download?fileId=${item.fileId}`, {
      method: 'POST',
      body: {
        ticket: '',
      }
    });
    const data = await res.json();
    await this.setState({ loading: false });
    await swal({
      text: data.message,
      buttons: false,
      timer: 2000,
    });
  };

  handleVerify = async () => {
    await this.setState({ loading: true });
    const res = await fetch('http://hins.work:49600/api/transfer/ticket/verify', {
      method: 'POST',
      body: this.state.ticket
    });
    const data = await res.json();
    if (data.status === 200) {
      console.log(data);
      this.setState({ status: data.data });
    }
    await this.setState({ loading: false });
  };

  handleDownload = async () => {
    await this.setState({ loading: true });
    const res = await fetch('http://hins.work:49600/api/transfer/download', {
      method: 'POST',
      body: {
        ticket: this.state.ticket,
      }
    });
    const data = await res.json();
    await this.setState({ loading: false });
    if (data.status === 200) await this.closeModal();
    await swal({
      text: data.message,
    });
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
              <span>{item.fileName}</span>
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
          <div className={styles.modalButtons}>
            <img src={cancel} alt="close" onClick={this.closeModal} />
            <img src={upload1} alt="upload" onClick={this.handleUpload} />
          </div>
        </Modal>
        <Modal
          isOpen={this.state.ticketModalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
          style={customStyles}
        >
          <p className={styles.modalFileName}>核对并下载凭据</p>
          <textarea placeholder="输入凭据" name="ticket" value={this.state.ticket} onChange={this.handleChangeInput} className={styles.ticketInput} />
          <div className={styles.modalInfo}>
            <p><span>凭据状态：</span>{this.state.status.status === undefined ? '请输入凭据后点击验证按钮' : this.state.status.status}</p>
            <p><span>签发者：</span>{this.state.status.signer === undefined ? '请输入凭据后点击验证按钮' : this.state.status.signer}</p>
            <p><span>签发时间：</span>{this.state.status.signDate === undefined ? '请输入凭据后点击验证按钮' : this.state.status.signDate}</p>
            <p><span>文件名：</span>{this.state.status.fileName === undefined ? '请输入凭据后点击验证按钮' : this.state.status.fileName}</p>
            <p><span>权限：</span>{this.state.status.permission === undefined ? '请输入凭据后点击验证按钮' : this.state.status.permission}</p>
          </div>
          <div className={styles.modalButtons}>
            <img src={cancel} alt="close" onClick={this.closeModal} />
            {this.state.status.status !== '可用' ? <img src={verify} alt="verify" onClick={this.handleVerify} /> : <img src={download1} alt="download" onClick={this.handleDownload} />}
          </div>
        </Modal>
      </div>
    );
  }
}
