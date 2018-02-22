/*
- Make the Play button work
- Make the Pause button work
- Disable the play button if it's playing
- Disable the pause button if it's not playing
- Make the PlayPause button work
- Make the JumpForward button work
- Make the JumpBack button work
- Make the progress bar work
  - change the width of the inner element to the percentage of the played track
  - add a click handler on the progress bar to jump to the clicked spot

Here is the audio API you'll need to use, `audio` is the <audio/> dom nod
instance, you can access it as `this.audio` in `AudioPlayer`

```js
// play/pause
audio.play()
audio.pause()

// change the current time
audio.currentTime = audio.currentTime + 10
audio.currentTime = audio.currentTime - 30

// know the duration
audio.duration

// values to calculate relative mouse click position
// on the progress bar
event.clientX // left position *from window* of mouse click
const rect = node.getBoundingClientRect()
rect.left // left position *of node from window*
rect.width // width of node
```

Other notes about the `<audio/>` tag:

- You can't know the duration until `onLoadedData`
- `onTimeUpdate` is fired when the currentTime changes
- `onEnded` is called when the track plays through to the end and is no
  longer playing

Good luck!
*/

import './index.css';
import React from 'react';
import * as PropTypes from 'prop-types';
import podcast from './podcast.mp3';
import mario from './mariobros.mp3';
import FaPause from 'react-icons/lib/fa/pause';
import FaPlay from 'react-icons/lib/fa/play';
import FaRepeat from 'react-icons/lib/fa/repeat';
import FaRotateLeft from 'react-icons/lib/fa/rotate-left';

class AudioPlayer extends React.Component {
  state = {
    isPlaying: false,
    duration: 0,
    progress: 0
  };

  static childContextTypes = {
    play: PropTypes.func,
    pause: PropTypes.func,
    jumpForward: PropTypes.func,
    jumpBack: PropTypes.func,
    isPlaying: PropTypes.bool,
    progress: PropTypes.number,
    setProgress: PropTypes.func
  };

  getChildContext() {
    return {
      play: this.play,
      pause: this.pause,
      jumpForward: this.jumpForward,
      jumpBack: this.jumpBack,
      isPlaying: this.state.isPlaying,
      progress: this.state.progress,
      setProgress: this.setProgress
    };
  }

  play = () => {
    this.audio.play();
    this.setState({ isPlaying: true });
  };

  pause = () => {
    this.audio.pause();
    this.setState({ isPlaying: false });
  };

  jumpForward = jump => {
    if (jump < 1) return;
    this.audio.currentTime += jump;
  };

  jumpBack = jump => {
    if (jump < 1) return;
    this.audio.currentTime -= jump;
  };

  setDuration = () => {
    this.setState({ duration: this.audio.duration });
  };

  setCurrentTime = () => {
    this.setState({ progress: this.audio.currentTime / this.audio.duration });
  };

  setProgress = progress => {
    if (progress < 0 || progress > 100) return;
    this.audio.currentTime = this.state.duration * progress;
    this.setState({ progress });
  };

  render() {
    return (
      <div className="audio-player">
        <audio
          src={this.props.source}
          onTimeUpdate={this.setCurrentTime}
          onLoadedData={this.setDuration}
          onEnded={() => this.setState({ isPlaying: false })}
          ref={n => (this.audio = n)}
        />
        {this.props.children}
      </div>
    );
  }
}

class Play extends React.Component {
  static contextTypes = {
    play: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired
  };

  render() {
    const { play, isPlaying } = this.context;

    return (
      <button className="icon-button" onClick={e => play()} disabled={isPlaying} title="play">
        <FaPlay />
      </button>
    );
  }
}

class Pause extends React.Component {
  static contextTypes = {
    pause: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired
  };

  render() {
    const { pause, isPlaying } = this.context;

    return (
      <button className="icon-button" onClick={e => pause()} disabled={!isPlaying} title="pause">
        <FaPause />
      </button>
    );
  }
}

class PlayPause extends React.Component {
  static contextTypes = {
    isPlaying: PropTypes.bool.isRequired
  };

  render() {
    const { isPlaying } = this.context;
    return isPlaying ? <Pause /> : <Play />;
  }
}

class JumpForward extends React.Component {
  static contextTypes = {
    isPlaying: PropTypes.bool.isRequired,
    jumpForward: PropTypes.func.isRequired
  };

  render() {
    const { jumpForward, isPlaying } = this.context;
    return (
      <button className="icon-button" onClick={e => jumpForward(10)} disabled={!isPlaying} title="Forward 10 Seconds">
        <FaRepeat />
      </button>
    );
  }
}

class JumpBack extends React.Component {
  static contextTypes = {
    isPlaying: PropTypes.bool.isRequired,
    jumpBack: PropTypes.func.isRequired
  };

  render() {
    const { jumpBack, isPlaying } = this.context;
    return (
      <button className="icon-button" onClick={e => jumpBack(10)} disabled={!isPlaying} title="Back 10 Seconds">
        <FaRotateLeft />
      </button>
    );
  }
}

class Progress extends React.Component {
  static contextTypes = {
    progress: PropTypes.number.isRequired,
    setProgress: PropTypes.func.isRequired
  };

  handleClick = event => {
    const { setProgress } = this.context;
    const rect = this.progressContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    setProgress(x / rect.width);
  };

  render() {
    const { progress } = this.context;

    return (
      <div className="progress" onClick={this.handleClick} ref={n => (this.progressContainer = n)}>
        <div
          className="progress-bar"
          style={{
            width: `${progress * 100}%`
          }}
        />
      </div>
    );
  }
}

const Exercise = () => (
  <div className="exercise">
    <AudioPlayer source={mario}>
      <Play /> <Pause /> <span className="player-text">Mario Bros. Remix</span>
      <Progress />
    </AudioPlayer>

    <AudioPlayer source={podcast}>
      <PlayPause /> <JumpBack /> <JumpForward />{' '}
      <span className="player-text">React30 Episode 010: React Virtualized</span>
      <Progress />
    </AudioPlayer>
  </div>
);

export default Exercise;
