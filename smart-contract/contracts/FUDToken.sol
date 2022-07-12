// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";

contract FUDToken is ERC20, ERC20PresetFixedSupply {
    constructor() ERC20PresetFixedSupply("Fud Token", "FUD", 1500000, msg.sender){}
}