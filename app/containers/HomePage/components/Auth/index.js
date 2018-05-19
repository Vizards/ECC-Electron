/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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

class Home extends Component<Props> {
  props: Props;

  state = {
    loginStyle: {},
    registerStyle: {},
    tab: 'login',
    loginEmail: '',
    loginPassword: '',
    registerEmail: '',
    registerPassword: '',
    department: '',
    job: ''
  };

  componentDidMount() {
    this.handleSwitchLogin();
  }

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
    fetch('http://127.0.0.1:49600/api/login', {
      method: 'POST',
      data: {
        email: this.state.loginEmail,
        password: this.state.loginPassword,
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.status === 200 && data.message === 'success!') { this.props.history.push('/node'); }
      })
      .catch(err => alert(err));
  };

  handleRegister = () => {
    fetch('http://127.0.0.1:49600/api/register', {
      method: 'POST',
      data: {
        email: this.state.registerEmail,
        password: this.state.registerPassword,
        department: this.state.department,
        job: this.state.job,
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.status === 200 && data.message === 'success!') { this.props.history.push('/node'); }
      })
      .catch(err => alert(err));
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
          <p>私钥保护密码</p>
          <input type="password" name="loginPassword" value={this.state.loginPassword} onChange={this.handleChange} />
          <img src={loginButton} alt="登录" onClick={this.handleLogin} />
        </div>
        <div className={styles.register} style={{ display: this.state.tab === 'register' ? 'flex' : 'none' }}>
          <p>用户标识</p>
          <input type="text" name="registerEmail" value={this.state.registerEmail} onChange={this.handleChange} />
          <p>私钥保护密码</p>
          <input type="password" name="registerPassword" value={this.state.registerPassword} onChange={this.handleChange} />
          <div className={styles.addon}>
            <input type="text" placeholder="部门" name="department" value={this.state.department} onChange={this.handleChange} />
            <input type="text" placeholder="职位" name="job" value={this.state.job} onChange={this.handleChange} />
          </div>
          <img src={registerButton} alt="注册" onClick={this.handleRegister} />
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
