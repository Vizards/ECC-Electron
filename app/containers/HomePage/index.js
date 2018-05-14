// @flow
import React, { Component } from 'react';
import Auth from './components/Auth/index';
import title from './images/group3.svg';
import styles from './style.css';

type Props = {};

export default class HomePage extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.Homepage}>
        <img src={title} alt="证链云" className={styles.logo} />
        <Auth />
      </div>
    );
  }
}
