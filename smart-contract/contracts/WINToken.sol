// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract WINToken is ERC20, AccessControlEnumerable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("Win", "WIN") {
         _setupRole(MINTER_ROLE, _msgSender());
    }

    function mint(address account, uint256 amount) public returns (bool) {
        //sonlyMinter modifier has been removed
        require(hasRole(MINTER_ROLE, _msgSender()), "must have minter role to mint");
        _mint(account,amount);
        return true;
    }
}
