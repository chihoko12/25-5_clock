import React, { Component } from "react";

class LengthControl extends Component {
  render() {
    return (
      <div className="length-control">
        <h2 className="control-title" id={this.props.titleID}>{this.props.title}</h2>
        <button
          className="btn-level"
          id={this.props.minID}
          onClick={this.props.onClick}
          value="-"
        >
          <i className="fa fa-arrow-down fa-2x" />
        </button>

        <span className="btn-level" id={this.props.lengthID}>{this.props.length}</span>

        <button
          className="btn-level"
          id={this.props.addID}
          onClick={this.props.onClick}
          value="+"
        >
          <i className="fa fa-arrow-up fa-2x" />
        </button>
      </div>
    );
  }
}

export default LengthControl;
