// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';

import logo from './images/Home/group-5.svg';
import register from './images/Home/group-3.svg';
import login from './images/Home/group-4.svg';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <img src={logo} alt="logo" />
        <div className={styles.buttons}>
          <Link to="/register"><img src={register} alt="register" /></Link>
          <Link to="/login"><img src={login} alt="login" /></Link>
        </div>
      </div>
    );
  }
}
