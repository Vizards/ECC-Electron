import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styles from './Register.css';

import title from './images/Register/group-4.svg';
import back from './images/Login/arrow-right.svg';
import button from './images/Register/group-3.svg';

const ipc = require('electron').ipcRenderer;

type Props = {
  history: any
};

class Register extends Component<Props> {
  props: Props;

  state = {
    email: '',
    password: '',
    text: '',
  };

  handleChange = (e) => {
    console.log(e.target.type);
    this.setState({ [e.target.type]: e.target.value });
  };

  handleSubmit = () => {
    ipc.send('get-app-path');
    fetch('http://127.0.0.1:49600/api/register', {
      method: 'POST',
      data: {
        email: this.state.email,
        password: this.state.password,
        dir: global.appPath,
        channel: this.state.text
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200 && data.message === 'success!') { this.props.history.push('/main'); }
      })
      .catch(err => alert(err));
  };

  render() {
    return (
      <div className={styles.register} data-tid="register">
        <Link to="/" className={styles.back}><img src={back} alt="back" /></Link>
        <img src={title} alt="title" className={styles.title} />
        <div className={styles.form}>
          <input type="email" placeholder="邮箱" value={this.state.email} onChange={this.handleChange} />
          <input type="password" placeholder="密码" value={this.state.password} onChange={this.handleChange} />
          <input type="text" placeholder="所属部门" value={this.state.department} onChange={this.handleChange} />
          <a onClick={this.handleSubmit}><img src={button} alt="register" /></a>
        </div>
      </div>
    );
  }
}

export default withRouter(Register);
