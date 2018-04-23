// @flow
import React, { Component } from 'react';
import styles from './Node.css';

import cloud from './images/Node/cloud.svg';
import shape from './images/Node/shape.svg';

type Props = {};

export default class Node extends Component<Props> {
  props: Props;

  state = {
    data: [],
  };

  async componentWillMount() {
    const res = await fetch('http://127.0.0.1:49600/api/node');
    const data = await res.json();
    if (data.status === 200) {
      this.setState({
        data: data.data,
      });
    }
  }

  render() {
    return (
      <div className={styles.node}>
        <span className={styles.title}>
          <img src={cloud} alt="cloud" />
          <p>云端服务正常 {this.state.data.length} 个节点正在运行</p>
        </span>
        <div className={styles.detail}>
          {this.state.data.map((item, index) => (
            <div key={index} className={styles.item} style={{ opacity: item.status === 'up' ? 1 : 0.5 }}>
              <img src={shape} alt="shape" />
              <p className={styles.name}>{item.name}</p>
              <p className={styles.host}>{item.host}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
