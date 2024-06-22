import React, { Component } from "react";
import LengthControl from "./LengthControl";

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerState: "stopped",
      timerType: "Session",
      time: 1500,
      intervalID: "",
      alarmColor: { color: "#ffffff" }
    };
    this.setBreakLength = this.setBreakLength.bind(this);
    this.setSessionLength = this.setSessionLength.bind(this);
    this.lengthControl = this.lengthControl.bind(this);
    this.timerControl = this.timerControl.bind(this);
    this.startCountDown = this.startCountDown.bind(this);
    this.decrementTime = this.decrementTime.bind(this);
    this.phaseControl = this.phaseControl.bind(this);
    this.warning = this.warning.bind(this);
    this.buzzer = this.buzzer.bind(this);
    this.switchTimer = this.switchTimer.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.reset = this.reset.bind(this);
  }

  setBreakLength(e) {
    this.lengthControl(
      "breakLength",
      e.currentTarget.value,
      this.state.breakLength,
      "Session"
    );
  }

  setSessionLength(e) {
    this.lengthControl(
      "sessionLength",
      e.currentTarget.value,
      this.state.sessionLength,
      "Break"
    );
  }

  lengthControl(lengthType, sign, currentLength, timerType) {
    if (this.state.timerState === "running") return;

    const isDecrement = sign === "-";
    const isIncrement = sign === "+";
    const isSession = this.state.timerType === timerType;

    if (isSession) {
      if (isDecrement && currentLength > 1 ) {
        this.setState({ [lengthType]: currentLength - 1 });
      } else if (isIncrement && currentLength < 60) {
        this.setState({ [lengthType]: currentLength + 1 });
      }
    } else {
      if (isDecrement && currentLength > 1) {
        this.setState({
          [lengthType]: currentLength - 1,
          time: (currentLength - 1) * 60
        });
      } else if (isIncrement && currentLength < 60) {
        this.setState({
          [lengthType]: currentLength + 1,
          time: (currentLength + 1) * 60
        });
      }
    }
  }

  timerControl() {
    if (this.state.timerState === "stopped") {
      this.startCountDown();
      this.setState({ timerState: "running" });
    } else {
      this.setState({ timerState: "stopped" });
//      clearInterval(this.state.intervalID);
      if (this.state.intervalID) {
        this.state.intervalID.cancel()
      };
    }
  }

  startCountDown() {
    const startTimer = () => {
      this.decrementTime();
      this.phaseControl();
    }

    const interval = 1000;
    let nextExpectedTime = (new Date()).getTime() + interval;
    let timerID = null;

    const runTimer = () => {
      const currentTime = (new Date()).getTime();
      const delay = nextExpectedTime - currentTime;
      nextExpectedTime += interval;
      timerID = setTimeout(runTimer, delay);
      startTimer();
    }

    const cancelTimer = () => {
      clearTimeout(timerID);
    };

    this.setState({
      intervalID: {
        cancel: cancelTimer
      }
    });

    timerID = setTimeout(runTimer, interval);
  }

  decrementTime() {
    this.setState({ time: this.state.time - 1 });
  }

  phaseControl() {
    let currentTime = this.state.time;
    this.warning(currentTime);
    this.buzzer(currentTime);
    if (currentTime < 0) {
      if (this.state.intervalID) {
        this.state.intervalID.cancel();
      }

      if (this.state.timerType === "Session") {
        this.startCountDown();
        this.switchTimer(this.state.breakLength * 60, "Break");
      } else {
        this.startCountDown();
        this.switchTimer(this.state.sessionLength * 60, "Session");
      }
    }
  }

  warning(time) {
    if (time < 61) {
      this.setState({ alarmColor: { color: "#a50d0d" } });
    } else {
      this.setState({ alarmColor: { color: "#ffffff" } });
    }
  }

  buzzer(time) {
    if (time === 0) {
        this.audioBeep.play();
    }
  }

  switchTimer(newTime, newTimerType) {
    this.setState({
      time: newTime,
      timerType: newTimerType,
      alarmColor: { color: "#ffffff" }
    });
  }

  formatTime() {
    if (this.state.time < 0) return "00:00";

    let minutes = Math.floor(this.state.time / 60);
    let seconds = this.state.time - minutes * 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return minutes + ":" + seconds;
  }

  reset() {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timerState: "stopped",
      timerType: "Session",
      time: 1500,
      intervalID: "",
      alarmColor: { color: "#ffffff" }
    });
//    clearInterval(this.state.intervalID);
      if (this.state.intervalID) {
        this.state.intervalID.cancel();
      }
      this.audioBeep.pause();
      this.audioBeep.currentTime = 0;
  }

  render() {
    return (
      <div>
        <div className="main-title">25+5 Clock</div>
        <LengthControl
          addID="break-increment"
          length={this.state.breakLength}
          lengthID="break-length"
          minID="break-decrement"
          onClick={this.setBreakLength}
          title="Break Length"
          titleID="break-label"
        />
        <LengthControl
          addID="session-increment"
          length={this.state.sessionLength}
          lengthID="session-length"
          minID="session-decrement"
          onClick={this.setSessionLength}
          title="Session Length"
          titleID="session-label"
        />
        <div className="timer" style={this.state.alarmColor}>
          <div className="timer-wrapper">
            <div id="timer-label">{this.state.timerType}</div>
            <div id="time-left">{this.formatTime()}</div>
          </div>
        </div>
        <div className="timer-control">
          <button id="start_stop" onClick={this.timerControl}>
            <i className="fa fa-play fa-2x" style={{ marginRight: "2rem" }} />
            <i className="fa fa-pause fa-2x" style={{ marginRight: "2rem" }}  />
          </button>
          <button id="reset" onClick={this.reset}>
            <i className="fa fa-refresh fa-2x" />
          </button>
          <div className="author">
            Designed and Coded by <br />
            <a href="https://github.com/chihoko12" target="_blank" rel="noreferrer">chihoko12</a>
          </div>
          <audio
            id="beep"
            preload="auto"
            ref={e => { this.audioBeep = e; }}
            src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
          />
        </div>
      </div>
    )
  }
}

export default Clock;
