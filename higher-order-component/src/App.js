/*
Create a `withStorage` higher order component that manages saving and retrieving
the `sidebarIsOpen` state to local storage
*/

import './index.css';
import React from 'react';
import MenuIcon from 'react-icons/lib/md/menu';
import { set, get, subscribe } from './local-storage';

const withStorage = (storageKey, default_) => Comp => {
  class NewComp extends React.Component {
    static WrappedComponent = Comp;

    state = {
      [storageKey]: get(storageKey, default_)
    };

    componentDidMount() {
      this.unsubscribe = subscribe(() => {
        this.setState({
          [storageKey]: get('sidebarIsOpen')
        });
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    set = value => {
      set(storageKey, value);
    };

    render() {
      return <Comp {...this.props} {...this.state} setStorage={this.set} />;
    }
  }

  return NewComp;
};

class App extends React.Component {
  render() {
    const { sidebarIsOpen, setStorage } = this.props;
    return (
      <div className="app">
        <header>
          <button
            className="sidebar-toggle"
            title="Toggle menu"
            onClick={() => {
              setStorage(!sidebarIsOpen);
            }}
          >
            <MenuIcon />
          </button>
        </header>

        <div className="container">
          <aside className={sidebarIsOpen ? 'open' : 'closed'} />
          <main />
        </div>
      </div>
    );
  }
}

export default withStorage('sidebarIsOpen', true)(App);
