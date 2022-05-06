import React, { Component, useEffect } from "react";
import RideshareContract from "../../../build/contracts/Rideshare.json";
import store from "../../store";
import JoinRideContainer from "../../rideshare/ui/joinride/JoinRideContainer";
import { Link } from "react-router";
import "../../css/ridelist.css";

const contract = require("truffle-contract");

class RideList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rideshares: [],
      passengers: [],
      rideshareLoading: true,
    };
    this.getRides = this.getRides.bind(this);
    this.rideshareButton = this.rideshareButton.bind(this);
  }

  componentDidMount() {
    this.getRides();
  }

  getRides() {
    let web3 = store.getState().web3.web3Instance;

    const rideshare = contract(RideshareContract);
    rideshare.setProvider(web3.currentProvider);

    // Declaring this for later so we can chain functions on Authentication.
    var rideshareInstance;

    var _this = this;

    // Get current ethereum wallet.
    web3.eth.getCoinbase((error, coinbase) => {
      // Log errors, if any.
      if (error) {
        console.error(error);
      }

      rideshare.deployed().then(function (instance) {
        rideshareInstance = instance;

        rideshareInstance.getRideCount.call().then(function (result) {
          console.log("get rideshare count");
          console.log(result);
          let rideshareCount = result["c"][0];

          for (let i = 0; i < rideshareCount; i++) {
            rideshareInstance.getRide.call(i).then(function (result) {
              // If no error, login user.
              console.log("getridesharecount");
              console.log(result);
              var tempArr = _this.state.rideshares;
              let tempRideshares = tempArr.concat([result]);
              _this.setState({ rideshares: tempRideshares });
              // console.log("test2");
              // console.log(_this.state.rideshares);
              // debugger
              // return result;
              // return dispatch(loginUser())
            });
            rideshareInstance.getPassengers
              .call(i)
              .then(function (result) {
                var tempArr = _this.state.passengers;
                let tempPassengers = tempArr.concat([result]);
                _this.setState({ passengers: tempPassengers });
              })
              // Attempt to sign up user.
              .catch(function (result) {
                // If error...
              });
          }
          _this.setState({ rideshareLoading: false });
        });
      });
    });
  }

  rideshareButton(condition, bigNum, i) {
    let web3 = store.getState().web3.web3Instance;
    console.log("passengers");
    console.log(this.state.passengers);
    if (condition) {
      return (
        <button className="button-48" role="button">
          <span className="text">Leave</span>
        </button>
      );
    } else {
      return (
        <JoinRideContainer
          ride_number={i}
          payment={web3.fromWei(bigNum, "ether").toNumber()}
        />
      );
    }
  }

  render() {
    let web3 = store.getState().web3.web3Instance;

    if (this.state.rideshareLoading) {
      return <p>Loading</p>;
    } else {
      return (
        <main className="">
          <div className="table-wrapper">
            {/* <div className="pure-u-1-1 ride-details">
              {this.state.rideshares.map((ride, i) => {
                // console.log(ride);
                return (
                  <p>
                    WalletAddress: {ride[0]}, Expected Payments:
                    {web3.fromWei(ride[1], "ether").toNumber()},Capacity:
                    {ride[2]["c"][0]}, Original Address: {ride[3]}, Destination
                    Address:{ride[4]},
                    {this.rideshareButton(
                      this.state.passengers[i].indexOf(web3.eth.accounts[0]) >
                        -1,
                      ride[1],
                      i
                    )}
                    <Link to={`/details/${i}`}>Details</Link>
                  </p>
                );
              })}
            </div> */}

            <table className="fl-table">
              <thead>
                <tr>
                  <th>Wallet Address</th>
                  <th>Price Per Person</th>
                  <th>Capacity of Vehicle</th>
                  <th>Origin Address</th>
                  <th>Destination Address</th>
                  <th>Join Ride</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {this.state.rideshares.map((ride, i) => {
                  return (
                    <tr>
                      <td>{ride[0]}</td>
                      <td>{web3.fromWei(ride[1], "ether").toNumber()}</td>
                      <td>{ride[2]["c"][0]}</td>
                      <td>{ride[3]}</td>
                      <td>{ride[4]}</td>
                      <td>
                        {this.rideshareButton(
                          this.state.passengers[i].indexOf(
                            web3.eth.accounts[0]
                          ) > -1,
                          ride[1],
                          i
                        )}
                      </td>
                      <td>
                        <Link to={`/details/${i}`}>Details</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      );
    }
  }
}

export default RideList;
