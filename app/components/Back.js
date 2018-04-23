// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styles from './Back.css';

import arrow from './images/Back/arrow-right.svg';

type Props = {
  history: any,
  img: string
};

class Back extends Component<Props> {
  props: Props;

  render() {
    return (
      <div
        className={styles.back}
        data-tid="back"
        onClick={() => this.props.history.push('/main')}
      >
        <img src={arrow} alt="back" />
        <img src={this.props.img} alt="button" className={styles.title} />
      </div>
    );
  }
}

export default withRouter(Back);
