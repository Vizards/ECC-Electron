/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// @flow
import React, { Component } from 'react';
import { RingLoader } from 'react-spinners';
import Modal from 'react-modal';
import swal from 'sweetalert';
import styles from './style.css';

import Nav from '../../components/Nav';

import view from './images/view.svg';
import inside from './images/group8.svg';
import check from './images/group11.svg';
import close from './images/group6.svg';

type Props = {};

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
    const res = await fetch('http://127.0.0.1:49600/api/search');
    const data = await res.json();
    if (data.status === 200) {
      console.log(data);
      this.setState({ fileList: data.data });
    } else if (data.status === 400) {
      alert(data.message)
    }
  }

  handleChangeInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleView = async (item) => {
    await this.setState({ loading: true });
    const res = await fetch('http://127.0.0.1:49600/api/transfer/download', {
      method: 'POST',
      data: {
        fileId: item.fileId
      }
    });
    const data = await res.json();
    await this.setState({ loading: false });
    if (data.status === 200) {
      await swal({
        text: data.message,
      });
    } else if (data.status === 400) {
      await swal({
        text: data.message,
        timer: 2000,
      });
    } else {
      await swal({
        text: '发生错误，请重试',
        timer: 2000,
      });
    }
  };

  handleCheck = async (fileId) => {
    const res = await fetch(`http://127.0.0.1:49600/api/file?fileId=${fileId}`);
    const data = await res.json();
    console.log(data);
    if (data.status === 200) {
      await this.setState({
        fileData: data.data,
        modalIsOpen: true,
      });
    } else if (data.status === 400) {
      await swal({
        text: data.message,
        timer: 2000,
      });
    } else {
      await swal({
        text: '发生错误，请重试',
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
                {item.isInside ? <img src={inside} alt="内部" onClick={this.handleCheck.bind(this, item.fileId)} /> : <img src={view} alt="查看" onClick={this.handleView.bind(this, item)} />}
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
            <p><span>上传时间：</span>{this.state.fileData.date}</p>
            <p><span>hash：</span>{this.state.fileData.hash}</p>
          </div>
          <img src={close} alt="关闭" onClick={this.closeModal} className={styles.modalButton} />
        </Modal>
      </div>
    );
  }
}
