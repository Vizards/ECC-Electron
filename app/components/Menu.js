// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Menu.css';

import download from './images/Main/group-3.svg';
import upload from './images/Main/group-4.svg';
import query from './images/Main/group-5.svg';
import info from './images/Main/group-6.svg';

type Props = {};

export default class Menu extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.menu} data-tid="menu">
        <div>
          <Link to="/"><img src={download} alt="download" /></Link>
          <Link to="/"><img src={query} alt="query" /></Link>
        </div>
        <div>
          <Link to="/"><img src={upload} alt="upload" /></Link>
          <Link to="/"><img src={info} alt="info" /></Link>
        </div>
      </div>
    );
  }
}
