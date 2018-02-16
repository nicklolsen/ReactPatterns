import React from 'react';
import PropTypes from 'prop-types';

class Provider extends React.Component {
  static childContextTypes = {
    store: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      store: this.props.store
    };
  }

  render() {
    return this.props.children;
  }
}

const connect = (mapStateToProps, mapDispatchToProps) => Component => {
  class NewComponent extends React.Component {
    static contextTypes = {
      store: PropTypes.object.isRequired
    };

    componentDidMount() {
      const { store } = this.context;
      this.unsubscribe = store.subscribe(() => {
        this.forceUpdate();
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      const { store } = this.context;
      return <Component {...mapStateToProps(store.getState())} {...mapDispatchToProps(store.dispatch)} />;
    }
  }

  return NewComponent;
};

export { Provider, connect };
