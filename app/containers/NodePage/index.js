// @flow
import React, { Component } from 'react';
import styles from './style.css';

import Nav from '../../components/Nav';

import avatar from './images/avatar.svg';
import shape from './images/shape.svg';

type Props = {};

export default class NodePage extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.NodePage}>
        <Nav />
        <div className={styles.top}>
          <div className={styles.left}>
            <p><span>位置：</span>192.231.93.12:49600</p>
            <p><span>节点 ID：</span>V7gJVSgd2OHsv_s7c</p>
            <p><span>区块完整度：</span>100%</p>
            <p><span>工作状态：</span>正常</p>
            <p><span>合约执行情况：</span>正常</p>
          </div>
          <img src={shape} alt="节点信息" />
        </div>
        <div className={styles.bottom}>
          <div className={styles.left}>
            <p><span>节点属主：</span>test0@ecc.com</p>
            <p><span>用户公钥：</span>fcvgbhjnkmnjbhvgftgyhujikvgftgyhujijxs45r6…</p>
            <p><span>用户私钥：</span>已启用密码保护</p>
            <p><span>用户注册时间：</span>2018-5-6 29013</p>
            <p><span>状态：</span>UP</p>
          </div>
          <img src={avatar} alt="用户信息" />
        </div>
      </div>
    );
  }
}
