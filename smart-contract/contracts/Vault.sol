// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface AirVaultInterface {
	// lock tokens in the AirVault contract
	function deposit(string calldata symbol,uint256 amount) external returns(bool);

	// withdraw deposited tokens
	function withdraw(string calldata symbol,uint256 amount) external returns(bool);
	
	// provides how many tokens a specific address has deposited
	function lockedBalanceOf(string calldata symbol,address account) external view returns(uint256);

    event Deposit(address indexed from, string symbol, uint256 amount, uint256 totalLocked);
    event Withdraw(address indexed to, string symbol, uint256 amount, uint256 totalLocked);
}

contract AirVault is AirVaultInterface, Ownable{
    mapping(string=>address) allowedTokens;
    mapping(string=>mapping(address => uint256)) public tokenToAccountBalances;

    function allowToken(string calldata symbol, address tokenContractAddress) public{
        require(msg.sender==owner(),"Access Denied");
        allowedTokens[symbol]=tokenContractAddress;
    }

	function deposit(string calldata symbol, uint256 amount) public override returns(bool){
        require(allowedTokens[symbol]!=address(0),"Token Not Allowed");
        tokenToAccountBalances[symbol][msg.sender]+=amount;
        ERC20(allowedTokens[symbol]).transferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, symbol, amount, tokenToAccountBalances[symbol][msg.sender]);
        return true;
    }

	function withdraw(string calldata symbol, uint256 amount) public override returns(bool){
        require(tokenToAccountBalances[symbol][msg.sender]>=amount, "Insufficient Funds");
        tokenToAccountBalances[symbol][msg.sender]-=amount;
        ERC20(allowedTokens[symbol]).transfer(msg.sender, amount);
        emit Withdraw(msg.sender, symbol, amount, tokenToAccountBalances[symbol][msg.sender]);
        return true;
    }

    function lockedBalanceOf(string calldata symbol, address account) public override view returns(uint256){
        return tokenToAccountBalances[symbol][account];
    }
}
