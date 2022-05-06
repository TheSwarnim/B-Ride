pragma solidity ^0.5.16;


import "./../ownership/Ownable.sol";


/*
 * Killable
 * Base contract that can be killed by owner. All funds in contract will be sent to the owner.
 */
contract Killable is Ownable {
  function kill() onlyOwner public {
    selfdestruct(address(uint160(owner)));
  }
}
