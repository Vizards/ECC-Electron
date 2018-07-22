// @flow
import React, { Component } from 'react';
import swal from 'sweetalert';
import styles from './style.css';
import Nav from '../../components/Nav';

import freeze from './images/group7.svg';
import unlock from './images/group6.svg';

type Props = {};

export default class HumanPage extends Component<Props> {
  props: Props;

  state = {
    peopleList: [],
  };

  async componentWillMount() {
    await this.getData();
  }

  getData = async () => {
    const res = await fetch('http://127.0.0.1:33880/electron/profile/freeze');
    const data = await res.json();
    if (data.code === 200) {
      console.log(data);
      this.setState({ peopleList: data.data });
    } else {
      await swal({
        text: data.message !== undefined ? data.message : '发生错误，请重试',
        timer: 2000,
      });
    }
  };

  handleFreeze = async (item) => {
    const res = await fetch(`http://127.0.0.1:33880/electron/profile/freeze?id=${item.id}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
    });
    const data = await res.json();
    if (data.code === 200) {
      await this.getData();
    } else {
      await swal({
        text: data.message !== undefined ? data.message : '发生错误，请重试',
        timer: 2000,
      });
    }
  };

  render() {
    return (
      <div className={styles.HumanPage}>
        <Nav />
        <div className={styles.operateList}>
          {this.state.peopleList.map((item) => (
            <div key={item.id} className={styles.log}>
              <span>{item.email}</span>
              <span style={{ color: '#bababa'}}>{item.status}</span>
              <span style={{ color: '#bababa'}}>{item.department}</span>
              {item.isFreeze ? <img src={unlock} alt="解锁" onClick={this.handleFreeze.bind(this, item)} /> : <img src={freeze} alt="冻结" onClick={this.handleFreeze.bind(this, item)} />}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
