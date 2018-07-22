/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// @flow
import React, { Component } from 'react';
import { RingLoader } from 'react-spinners';
import Modal from 'react-modal';
import swal from 'sweetalert';
import styles from './style.css';

import Nav from '../../components/Nav';

import view from './images/view.svg';
import check from './images/group11.svg';
import close from './images/group6.svg';

type Props = {};

const { dialog } = require('electron').remote;

const customStyles = {
  overlay: {
    background: 'rgba(255, 255, 255, 0.8)'
  },
  content: {
    width: '465px',
    height: '234px',
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

export default class QueryPage extends Component<Props> {
  props: Props;

  state = {
    fileList: [],
    loading: false,
    fileId: '',
    fileData: {},
    modalIsOpen: false,
  };

  async componentWillMount() {
    const res = await fetch('http://127.0.0.1:33880/electron/affair');
    const data = await res.json();
    if (data.code === 200) {
      console.log(data);
      this.setState({ fileList: data.data });
    } else {
      await swal({
        text: data.message
      });
    }
  }

  handleChangeInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleView = async (item) => {
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
      const res = await fetch(`http://127.0.0.1:33880/electron/affair/download?fileId=${item.fileId}&downloadPath=${filePath[0]}`);
      const data = await res.json();
      console.log(data);
      await this.setState({ loading: false });
      if (data.code === 200) {
        await swal({
          text: data.message,
        });
      } else {
        await swal({
          text: data.message !== undefined ? data.message : '发生错误，请重试',
          timer: 2000,
        });
      }
    }
  };

  handleCheck = async (fileId) => {
    const res = await fetch(`http://127.0.0.1:33880/electron/affair/info?fileId=${fileId}`);
    const data = await res.json();
    console.log(data);
    if (data.code === 200) {
      await this.setState({
        fileData: data.data,
        modalIsOpen: true,
      });
    } else {
      await swal({
        text: data.message !== undefined ? data.message : '发生错误，请重试',
        timer: 2000,
      });
    }
  };

  closeModal = () => {
    this.setState({
      modalIsOpen: false
    });
  };

  render() {
    return (
      <div className={styles.QueryPage}>
        <div className={styles.loading} style={{ display: this.state.loading ? 'flex' : 'none' }}>
          <RingLoader
            color="#769be5"
            loading={this.state.loading}
          />
        </div>
        <Nav />
        <div className={styles.fileList}>
          {this.state.fileList.map(item => (
            <div key={item.fileId} className={styles.file}>
              <span>{item.fileName}</span>
              <div className={styles.buttons}>
                <img src={view} alt="查看" onClick={this.handleView.bind(this, item)} />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <input type="text" name="fileId" placeholder="请输入政务文件编号" value={this.state.fileId} onChange={this.handleChangeInput} />
          <img src={check} alt="核对凭据" onClick={this.handleCheck.bind(this, this.state.fileId)} />
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
          style={customStyles}
        >
          <p className={styles.modalFileName}>文件详情</p>
          <div className={styles.modalFileDetail}>
            <p><span>文件名：</span>{this.state.fileData.fileName}</p>
            <p><span>所有者：</span>{this.state.fileData.owner}</p>
            <p><span>上传时间：</span>{this.state.fileData.timestamp}</p>
            <p><span>hash：</span>{this.state.fileData.fileHash}</p>
            <p><span>机密文件：</span>{this.state.fileData.isClassified ? '是': '否'}</p>
          </div>
          <img src={close} alt="关闭" onClick={this.closeModal} className={styles.modalButton} />
        </Modal>
      </div>
    );
  }
}
