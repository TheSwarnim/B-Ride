pragma solidity ^0.5.16;

import './zeppelin/lifecycle/Killable.sol';

contract Rideshare is Killable {
  struct Passenger {
    uint price;
    string state; // initial, driverConfirmed, passengerConfirmed, enRoute, completion, canceled
  }

  struct Ride {
    address driver;
    uint drivingCost;
    uint capacity;
    string originAddress;
    string destAddress;
    uint createdAt;
    uint confirmedAt;
    uint departAt;
    mapping (address => Passenger) passengers;
    address[] passengerAccts;
  }
  
  Ride[] public rides;
  uint public rideCount;

  mapping (address => uint) reputation;
  
  // for now, only drivers can create Rides
  function createRide(uint _driverCost, uint _capacity, string memory _originAddress, string memory _destAddress, uint _confirmedAt, uint _departAt) public {
    address[] memory _passengerAccts;
    rides.push(Ride(msg.sender, _driverCost, _capacity, _originAddress, _destAddress, block.timestamp, _confirmedAt, _departAt, _passengerAccts));
  }
  
  // called by passenger
  function joinRide(uint rideNumber) public payable {
    Ride storage curRide = rides[rideNumber];
    require(msg.value == curRide.drivingCost);

    Passenger storage passenger = curRide.passengers[msg.sender];    
    
    passenger.price = msg.value;
    passenger.state = "initial";
    
    rides[rideNumber].passengerAccts.push(msg.sender) -1; //***
  }
  
  function getPassengers(uint rideNumber) view public returns(address[]memory) {
    return rides[rideNumber].passengerAccts;
  }

  function getPassengerRideState(uint rideNumber, address passenger) view public returns(string memory) {
    return rides[rideNumber].passengers[passenger].state;
  }

  function getRide(uint rideNumber) public view returns (
    address _driver,
    uint _drivingCost,
    uint _capacity,
    string memory _originAddress,
    string memory _destAddress,
    uint _createdAt,
    uint _confirmedAt,
    uint _departAt
  ) {
    Ride storage ride = rides[rideNumber];
    return (
      ride.driver,
      ride.drivingCost,
      ride.capacity,
      ride.originAddress,
      ride.destAddress,
      ride.createdAt,
      ride.confirmedAt,
      ride.departAt
    );
  }

  function getRideCount() public view returns(uint) {
    return rides.length;
  }
  
  function passengerInRide(uint rideNumber, address passengerAcct) public returns (bool) {
    Ride storage curRide = rides[rideNumber];
    for(uint i = 0; i < curRide.passengerAccts.length; i++) {
      if (curRide.passengerAccts[i] == passengerAcct) {
        return true;
      }
    }
    return false;
  }
  
  function cancelRide(uint rideNumber) public {
    Ride storage curRide = rides[rideNumber];
    require(block.timestamp < curRide.confirmedAt);
    if (msg.sender == curRide.driver) {
      for (uint i = 0; i < curRide.passengerAccts.length; i++) {
        address payable payable_addr = address(uint160(curRide.passengerAccts[i]));
        payable_addr.transfer(curRide.passengers[curRide.passengerAccts[i]].price);
      }
    } else if (passengerInRide(rideNumber, msg.sender)) {
      msg.sender.transfer(curRide.passengers[msg.sender].price);
    }
  }
  
  // called by passenger
  function confirmDriverMet(uint rideNumber) public {
    require(passengerInRide(rideNumber, msg.sender));
    Ride storage curRide = rides[rideNumber];
    if (keccak256(abi.encodePacked(curRide.passengers[msg.sender].state)) == keccak256(abi.encodePacked("passengersConfirmed"))) {
      curRide.passengers[msg.sender].state = "enRoute";
    } else {
      curRide.passengers[msg.sender].state = "driverConfirmed";
    }
  }
  
  // called by driver
  function confirmPassengersMet(uint rideNumber, address[] memory passengerAddresses) public {
    Ride storage curRide = rides[rideNumber];
    require(msg.sender == curRide.driver);
    for(uint i=0; i < passengerAddresses.length; i++) {
      string memory curState = curRide.passengers[passengerAddresses[i]].state;
      if (keccak256(abi.encodePacked(curRide.passengers[passengerAddresses[i]].state)) == keccak256(abi.encodePacked("driverConfirmed"))) {
        curRide.passengers[passengerAddresses[i]].state = "enRoute";
      } else {
        curRide.passengers[passengerAddresses[i]].state = "passengersConfirmed";
      }
    }
    // require(rides[rideNumber].state == "confirmed");
  }

  function enRouteList(uint rideNumber) view public returns(address[]memory) {
    Ride storage curRide = rides[rideNumber];
    address[] memory addressesEnRoute = new address[](5);
    uint count = 0;
    for(uint i = 0; i < curRide.passengerAccts.length; i++) {
      if (keccak256(abi.encodePacked(curRide.passengers[curRide.passengerAccts[i]].state)) == keccak256(abi.encodePacked("enRoute"))) {
        addressesEnRoute[count] = (curRide.passengerAccts[i]);
        count++;
      }
    }
  }
  
  // called by passenger
  function arrived(uint rideNumber) public {
    require(passengerInRide(rideNumber, msg.sender));
    Ride storage curRide = rides[rideNumber];
    address(uint160(curRide.driver)).transfer(curRide.passengers[msg.sender].price);
    curRide.passengers[msg.sender].state = "completion";
  }
}
