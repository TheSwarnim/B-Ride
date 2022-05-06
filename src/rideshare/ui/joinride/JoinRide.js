import React, { Component } from "react";

class JoinRide extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(event) {
    this.props.onJoinRideFormSubmit(this.props.ride_number, this.props.payment);
  }

  render() {
    return (
      <button
        onClick={this.handleSubmit.bind(this)}
        className="button-48"
        role="button"
      >
        <span className="text">Join Ride</span>
      </button>
    );
  }
}

export default JoinRide;
