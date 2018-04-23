// @flow
import React, { Component } from 'react';
import Modal from 'react-modal';

import styles from './Query.css';
import shape from './images/Query/shape.svg';
import button from './images/Query/group-3.svg';
import close from './images/Query/group.svg';

Modal.setAppElement('#root');

type Props = {};

const customStyles = {
  overlay: {
    background: '#101628'
  },
  content: {
    width: '80%',
    height: '60%',
    margin: 'auto',
    borderRadius: '8px',
    background: '#223159',
    border: '0 none',
    textAlign: 'center',
  }
};

export default class Query extends Component<Props> {
  props: Props;

  state = {
    data: [],
    detail: [],
    modalIsOpen: false,
  };

  async componentWillMount() {
    const res = await fetch('http://127.0.0.1:49600/api/block');
    const data = await res.json();
    console.log(data);
    if (data.status === 200) {
      this.setState({
        data: data.data,
      });
    }
  }

  handleClick = async (index) => {
    console.log(index);
    const res = await fetch(`http://127.0.0.1:49600/api/transaction?index=${index}`);
    const data = await res.json();
    if (data.status === 200) {
      this.setState({
        detail: data.data,
        modalIsOpen: true
      });
    }
    console.log(data);
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    return (
      <div className={styles.query}>
        {this.state.data.map(item => (
          <div key={item.index} className={styles.list}>
            <div className={styles.title}>
              <img src={shape} alt="icon" />
              <span>{item.title}</span>
            </div>
            <a onClick={this.handleClick.bind(this, item.index)}><img src={button} alt="查看" /></a>
          </div>
        ))}
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Example Modal"
          style={customStyles}
        >
          <div>
            <div className={styles.header}>
              <span>数据哈希</span>
              <span>数据 ID</span>
              <span>数据级别</span>
              <span>拥有者</span>
              <span>时间戳</span>
              <span>类型</span>
            </div>
            {this.state.detail.map(item => (
              <div className={styles.row} key={item.id}>
                <span>{item.hash}</span>
                <span>{item.id}</span>
                <span>{item.level}</span>
                <span>{item.owner}</span>
                <span>{item.timestamp}</span>
                <span>{item.type}</span>
              </div>
            ))}
          </div>
          <a onClick={this.closeModal} style={{ paddingTop: '39px', display: 'block' }}><img src={close} alt="close"/></a>
        </Modal>
      </div>
    );
  }
}
