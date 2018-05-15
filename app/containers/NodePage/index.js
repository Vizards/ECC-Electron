// @flow
import React, { Component } from 'react';
import styles from './style.css';

import Nav from '../../components/Nav';

import avatar from './images/avatar.svg';
import shape from './images/shape.svg';

type Props = {};

export default class NodePage extends Component<Props> {
  props: Props;

  state = {
    data: {},
  };

  async componentWillMount() {
    const res = await fetch('http://hins.work:49600/api/info');
    const data = await res.json();
    if (data.status === 200) {
      console.log(data);
      this.setState({ data: data.data });
    }
  }

  render() {
    return (
      <div className={styles.NodePage}>
        <Nav />
        <div className={styles.top}>
          <div className={styles.left}>
            <p><span>位置：</span>{this.state.data.location}</p>
            <p><span>节点 ID：</span>{this.state.data.nodeId}</p>
            <p><span>区块完整度：</span>{this.state.data.blockIntegrity}</p>
            <p><span>工作状态：</span>{this.state.data.contractStatus}</p>
            <p><span>合约执行情况：</span>{this.state.data.workStatus}</p>
          </div>
          <img src={shape} alt="节点信息" />
        </div>
        <div className={styles.bottom}>
          <div className={styles.left}>
            <p><span>节点属主：</span>{this.state.data.owner}</p>
            <p><span>用户公钥：</span>{this.state.data.publicKey}</p>
            <p><span>用户私钥：</span>{this.state.data.privateKey}</p>
            <p><span>用户注册时间：</span>{this.state.data.regDate}</p>
            <p><span>状态：</span>{this.state.data.status}</p>
          </div>
          <img src={avatar} alt="用户信息" />
        </div>
      </div>
    );
  }
}
