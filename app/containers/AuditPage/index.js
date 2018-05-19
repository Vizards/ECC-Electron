// @flow
import React, { Component } from 'react';
import Modal from 'react-modal';
import swal from 'sweetalert';
import styles from './style.css';

import Nav from '../../components/Nav';

import detail from './images/group7.svg';
import source from './images/group5.svg';
import close from './images/group6.svg';

type Props = {};

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

export default class AuditPage extends Component<Props> {
  props: Props;

  state = {
    operateList: [],
    modalIsOpen: false,
    sourceModalIsOpen: false,
    log: {},
    fileId: '',
    sourceData: [],
  };

  async componentWillMount() {
    const res = await fetch('http://127.0.0.1:49600/api/log');
    const data = await res.json();
    if (data.status === 200) {
      console.log(data);
      this.setState({ operateList: data.data });
    }
  }

  handleDisplay = async (item) => {
    console.log(item);
    await this.setState({
      log: item,
      modalIsOpen: true
    });
  };

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
      sourceModalIsOpen: false
    });
  };

  handleChangeInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleTrack = async (fileId) => {
    const res = await fetch(`http://127.0.0.1:49600/api/log/track?fileId=${fileId}`);
    const data = await res.json();
    if (data.status === 200) {
      console.log(data);
      this.setState({
        sourceModalIsOpen: true,
        sourceData: data.data.downloadLogs,
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
      <div className={styles.AuditPage}>
        <Nav />
        <div className={styles.operateList}>
          {this.state.operateList.map(item => (
            <div key={item.logId} className={styles.log}>
              <span>
                {item.timestamp}&nbsp;&nbsp;&nbsp;&nbsp;
                {item.operator}&nbsp;&nbsp;&nbsp;&nbsp;
                {item.actionType}&nbsp;&nbsp;&nbsp;&nbsp;
                {item.fileName}
              </span>
              <img src={detail} alt="详情" onClick={this.handleDisplay.bind(this, item)} />
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <input type="text" name="fileId" placeholder="请输入政务文件编号" value={this.state.fileId} onChange={this.handleChangeInput} />
          <img src={source} alt="传播溯源" onClick={this.handleTrack.bind(this, this.state.fileId)} />
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
          style={customStyles}
        >
          <p className={styles.modalFileName}>操作详情</p>
          <div className={styles.modalFileDetail}>
            <p><span>交易 ID：</span>{this.state.log.logId}</p>
            <p><span>操作者：</span>{this.state.log.operator}</p>
            <p><span>操作类型：</span>{this.state.log.actionType}</p>
            <p><span>文件名：</span>{this.state.log.fileName}</p>
            <p><span>时间戳：</span>{this.state.log.timestamp}</p>
            <p><span>所属部门：</span>{this.state.log.department}</p>
            <p><span>职位：</span>{this.state.log.job}</p>
            <p><span>IP：</span>{this.state.log.ip}</p>
          </div>
          <img src={close} alt="关闭" onClick={this.closeModal} className={styles.modalButton} />
        </Modal>
        <Modal
          isOpen={this.state.sourceModalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
          style={customStyles}
        >
          <p className={styles.modalFileName}>文件溯源</p>
          {this.state.sourceData.map((item, key) => (
            <div className={styles.modalListItem} key={key}>
              <p><span>下载者：</span>{item.operator}</p>
              <p><span>时间：</span>{item.timestamp}</p>
              <p><span>IP：</span>{item.ip}</p>
            </div>
          ))}
        </Modal>
      </div>
    );
  }
}
