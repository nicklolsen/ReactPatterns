import './index.css';
import React, { Component } from 'react';
import FaPlay from 'react-icons/lib/fa/play';
import FaPause from 'react-icons/lib/fa/pause';
import FaForward from 'react-icons/lib/fa/forward';
import FaBackward from 'react-icons/lib/fa/backward';

class RadioGroup extends Component {
  state = {
    isActive: this.props.defaultValue
  };

  handleClick = activeValue => {
    this.setState({ isActive: activeValue });
  };

  render() {
    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        isActive: child.props.value === this.state.isActive,
        handleClick: this.handleClick
      });
    });

    return (
      <fieldset className="radio-group">
        <legend>{this.props.legend}</legend>
        {children}
      </fieldset>
    );
  }
}

class RadioButton extends Component {
  render() {
    const { isActive, handleClick, value } = this.props;
    const className = 'radio-button ' + (isActive ? 'active' : '');
    return (
      <button className={className} onClick={e => handleClick(value)}>
        {this.props.children}
      </button>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <RadioGroup defaultValue="pause" legend="Radio Group">
          <RadioButton value="back">
            <FaBackward />
          </RadioButton>
          <RadioButton value="play">
            <FaPlay />
          </RadioButton>
          <RadioButton value="pause">
            <FaPause />
          </RadioButton>
          <RadioButton value="forward">
            <FaForward />
          </RadioButton>
        </RadioGroup>
      </div>
    );
  }
}

export default App;
