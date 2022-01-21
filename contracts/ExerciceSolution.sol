pragma solidity ^0.6.0;

import "./ERC20Claimable.sol";
import "./MyERC20.sol";

contract ExerciceSolution {

    ERC20Claimable claimableERC20;
    MyERC20 myERC20;
    mapping(address => uint256) custody;

    constructor (ERC20Claimable _claimableToken, MyERC20 _myERC20) public {
        claimableERC20 = _claimableToken;
        myERC20 = _myERC20;
    }

    function claimTokensOnBehalf() external {
        claimableERC20.claimTokens();
        custody[msg.sender] += claimableERC20.distributedAmount();
        myERC20.mint(msg.sender, claimableERC20.distributedAmount());
    }

	function tokensInCustody(address callerAddress) external returns (uint256){
        return custody[callerAddress];
    }

	function withdrawTokens(uint256 amountToWithdraw) external returns (uint256){
        require(claimableERC20.balanceOf(address(this)) >= amountToWithdraw);
        require(custody[msg.sender] >= amountToWithdraw);
        require(amountToWithdraw > 0, "negative amount");
        
        
        claimableERC20.transfer(msg.sender, amountToWithdraw);
        custody[msg.sender] -= amountToWithdraw;
        myERC20.burn(msg.sender, amountToWithdraw);
        return 0;
    }

	function depositTokens(uint256 amountToWithdraw) external returns (uint256){
        require(claimableERC20.allowance(msg.sender, address(this)) >= amountToWithdraw);
        require(amountToWithdraw > 0);
        claimableERC20.transferFrom(msg.sender, address(this), amountToWithdraw);
        custody[msg.sender] += amountToWithdraw;
        myERC20.mint(msg.sender, amountToWithdraw);
        return 0;
    }

	function getERC20DepositAddress() external returns (address) {
        return address(myERC20);
    }
}