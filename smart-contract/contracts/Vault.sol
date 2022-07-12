// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

interface AirVault {
	// lock tokens in the AirVault contract
	function deposit(uint256 amount) external returns(bool);

	// withdraw deposited tokens
	function withdraw(uint256 amount) external returns(bool);
	
	// provides how many tokens a specific address has deposited
	function lockedBalanceOf(address account) external view returns(uint256);
    
    event Deposit(address indexed from, uint256 amount, uint256 totalLocked);
    event Withdraw(address indexed to, uint256 amount, uint256 totalLocked);
}

contract Vault is AirVault{
    address owner;
    address FUDTokenAddress;
    mapping(address => uint256) public accountBalances;

    constructor(address fudTokenAddress){
        owner = msg.sender;
        FUDTokenAddress = fudTokenAddress;
    }

	function deposit(uint256 amount) public override returns(bool){
        //needs to be atomic
        accountBalances[msg.sender]+=amount;
        ERC20(FUDTokenAddress).transferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, amount, accountBalances[msg.sender]);
        return true;
    }

	function withdraw(uint256 amount) public override returns(bool){
        require(accountBalances[msg.sender]>=amount, "Insufficient funds");
        accountBalances[msg.sender]-=amount;
        ERC20(FUDTokenAddress).transfer(msg.sender, amount);
        emit Withdraw(msg.sender, amount, accountBalances[msg.sender]);
        return true;
    }

    function lockedBalanceOf(address account) public override view returns(uint256){
        return accountBalances[account];
    }

    function fudtokenaddress() public view returns(address){
        return FUDTokenAddress;
    }
}
