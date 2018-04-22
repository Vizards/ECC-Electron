// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styles from './Exit.css';

import button from './images/Main/group.svg';

type Props = {
  history: any
};

class Exit extends Component<Props> {
  props: Props;

  handleClick = () => {
    fetch('http://127.0.0.1:49600/api/logout', {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'success!') { this.props.history.push('/'); }
      })
      .catch(err => alert(err));
  };

  render() {
    return (
      <div className={styles.exit} data-tid="exit" >
        <a onClick={this.handleClick}><img src={button} alt="button" /></a>
      </div>
    );
  }
}

export default withRouter(Exit);
