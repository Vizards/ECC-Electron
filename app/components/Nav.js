// @flow
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from './images/logo.svg';
import styles from './Nav.css';

type Props = {};

export default class Nav extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.Nav}>
        <img src={logo} alt="政链云" />
        <div className={styles.navList}>
          <NavLink to="/node" activeClassName={styles.selected}>节点信息</NavLink>
          <NavLink to="/transmit" activeClassName={styles.selected}>政务传输</NavLink>
          <NavLink to="/query" activeClassName={styles.selected}>政务查询</NavLink>
          <NavLink to="/audit" activeClassName={styles.selected}>监管审计</NavLink>
          <NavLink to="/human" activeClassName={styles.selected}>人员管理</NavLink>
        </div>
      </div>
    );
  }
}
