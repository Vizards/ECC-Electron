// @flow
import React, { Component } from 'react';
import styles from './style.css';
import Nav from '../../components/Nav';

type Props = {};

export default class HumanPage extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.HumanPage}>
        <Nav />
        aaa
      </div>
    );
  }
}
