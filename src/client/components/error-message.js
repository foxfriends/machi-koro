'use strict';
import React from 'react';

class ErrorMessage extends React.Component {
  duration = 1000 * 6;
  timeout = null;
  constructor(props) {
    super(props);
    this.timeout = window.setTimeout(this.props.close, this.duration);
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
  }

  render() {
    return <div className="error-message">{this.props.message}</div>;
  }
}

export default ErrorMessage;
