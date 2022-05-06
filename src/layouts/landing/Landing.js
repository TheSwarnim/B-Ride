import React, { Component } from "react";

class Landing extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 para-container">
            <div className="para">
              <h1>What is B Ride?</h1>
              <p>
                B-Ride enables drivers to offer ride-sharing services without
                relying on a trusted third party. Both riders and drivers can
                learn whether they can share rides while preserving their trip
                data, including pick-up/drop-off location, departure/arrival
                date and travel price.
              </p>
              <p>
                To preserve riders’ trip privacy, we use cloaking, so a rider
                posts a cloaked pick-up and drop-off location as well as pick-up
                time. Then, interested drivers use off-line matching technique .
              </p>
            </div>

            <div className="para">
              <h1>Why B Ride?</h1>
              <ul>
                <li>Ride Sharing Decentralized Application</li>
                <li>Built atop open and permissionless blockchain</li>
                <li>Privacy with transparency</li>
                <li>Fair payments</li>
              </ul>
            </div>

            <div className="para">
              <h1>Perks of using B Rider</h1>
              <p>
                A rider can select the best-matched driver to share a trip based
                on some heuristics , B-Ride computes the reputation of drivers
                based on their prior behaviours. Unlike, current centralized
                reputation approache
              </p>
            </div>

            <div className="para">
              <h1>Advantages of B Ride</h1>
              <ul>
                <li>
                  Data Security: Cloaking is used to provide the security of
                  ride
                </li>
                <li>Time locked protocol and zero knowledge set membership</li>
                <li>Pay as you ride</li>
                <li>Decentralized Reputation mechanism</li>
                <li>Protocol deployed on ethereum testnet.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default Landing;
