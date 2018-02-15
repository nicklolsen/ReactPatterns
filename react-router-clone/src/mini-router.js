////////////////////////////////////////////////////////////////////////////////
import React from 'react';
import { createBrowserHistory } from 'history';
import * as PropTypes from 'prop-types';

/*
// create a new history instance
history = createBrowserHistory()

// read the current URL
history.location

// listen for changes to the URL
const unsubscribe = history.listen(() => {
  history.location // is now different
})

// change the URL
history.push('/something')
*/

class Router extends React.Component {
  constructor() {
    super();
    this.history = createBrowserHistory();
    this.unsubscribe = this.history.listen(this.locationChanged);
    this.state = {
      location: this.history.location
    };
  }

  static childContextTypes = {
    history: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      history: this.history
    };
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  locationChanged = () => {
    this.setState({ location: this.history.location });
  };

  render() {
    return this.props.children;
  }
}

class Route extends React.Component {
  static contextTypes = {
    history: PropTypes.object.isRequired
  };

  render() {
    const { pathname } = this.context.history.location;
    const { path, exact, render, component } = this.props;

    const match = pathname.startsWith(path);
    if (!match || (exact && path.length !== pathname.length)) return null;

    return component ? component({ match: path }) : render({ match: path });
  }
}

class Link extends React.Component {
  static contextTypes = {
    history: PropTypes.object.isRequired
  };

  handleClick = e => {
    e.preventDefault();
    const { history } = this.context;
    history.push(this.props.to);
  };

  render() {
    return (
      <a href={`${this.props.to}`} onClick={this.handleClick}>
        {this.props.children}
      </a>
    );
  }
}

export { Router, Route, Link };
