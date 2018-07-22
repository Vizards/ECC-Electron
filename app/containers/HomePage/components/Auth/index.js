/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import styles from './style.css';
import loginButton from '../images/login-button.svg';
import registerButton from '../images/register-button.svg';

type Props = {
  history: any
};

const clickedStyle = {
  borderBottom: '2px solid #769be5',
  fontWeight: 500,
  color: '#000',
  background: '#fff',
};

const normalStyle = {
  borderBottom: '2px solid transparent',
  background: '#f1f1f1',
  fontWeight: 'normal',
  color: '#b9b9b9'
};

const { dialog } = require('electron').remote;


class Home extends Component<Props> {
  props: Props;

  state = {
    loginStyle: {},
    registerStyle: {},
    tab: 'login',
    loginEmail: '',
    registerEmail: '',
    registerPassword: '',
    path: '',
    filename: '选择私钥文件'
  };

  componentDidMount() {
    this.handleSwitchLogin();
  }

  handleSelect = async () => {
    const fileArray = await dialog.showOpenDialog({
      title: '选择您的私钥文件',
      openDirectory: false,
      showHiddenFiles: true,
      createDirectory: true,
      promptToCreate: true,
      treatPackageAsDirectory: true,
      multiSelections: false,
    });
    await this.setState({
      path: fileArray[0],
      filename: fileArray[0].substr(fileArray[0].lastIndexOf('/')+1)
    });
  };

  handleSwitchLogin = () => {
    this.setState({
      loginStyle: clickedStyle,
      registerStyle: normalStyle,
      tab: 'login',
    });
  };

  handleSwitchRegister = () => {
    this.setState({
      registerStyle: clickedStyle,
      loginStyle: normalStyle,
      tab: 'register',
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleLogin = () => {
    fetch(`http://127.0.0.1:33880/electron/profile/login?password=${this.state.loginEmail}&privateKeyFile=${this.state.path}`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.code === 200 && data.message === 'success') {
          this.props.history.push('/node');
        } else {
          swal({
            text: data.message !== undefined ? data.message : '发生错误，请重试',
            timer: 2000,
          });
        }
      })
      .catch(err => swal({ text: err }));
  };

  handleRegister = () => {
    fetch(`http://127.0.0.1:33880/electron/profile/register?password=${this.state.registerPassword}&reservedInfo=${this.state.registerEmail}`, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.code === 200 && data.message === 'success') {
          swal({
            text: data.data,
          });
          this.handleSwitchLogin();
        } else {
          swal({
            text: data.message !== undefined ? data.message : '发生错误，请重试',
            timer: 2000,
          });
        }
      })
      .catch(err => swal({ text: err }));
  };

  render() {
    return (
      <div className={styles.auth} data-tid="auth">
        <div className={styles.header}>
          <div style={this.state.loginStyle} onClick={this.handleSwitchLogin}>登  录</div>
          <div style={this.state.registerStyle} onClick={this.handleSwitchRegister}>注  册</div>
        </div>
        <div className={styles.login} style={{ display: this.state.tab === 'login' ? 'flex' : 'none' }}>
          <p>用户标识</p>
          <input type="text" name="loginEmail" value={this.state.loginEmail} onChange={this.handleChange} />
          <p>私钥文件</p>
          <div className={styles.input} onClick={this.handleSelect}>{this.state.filename}</div>
          <img src={loginButton} alt="登录" onClick={this.handleLogin} />
        </div>
        <div className={styles.register} style={{ display: this.state.tab === 'register' ? 'flex' : 'none' }}>
          <p>用户标识</p>
          <input type="text" name="registerEmail" value={this.state.registerEmail} onChange={this.handleChange} />
          <p>私钥保护密码</p>
          <input type="password" name="registerPassword" value={this.state.registerPassword} onChange={this.handleChange} />
          <img src={registerButton} alt="注册" onClick={this.handleRegister} />
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
