pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20
{
    mapping(address => bool) _isminter;
    constructor() public ERC20("erc20", "ok") {
        _isminter[msg.sender] = true;
        _mint(msg.sender, 10);
    }    
	function setMinter(address minterAddress, bool isMinter)  external {
        require(_isminter[msg.sender]);
        _isminter[minterAddress] = isMinter;
    }
	function mint(address toAddress, uint256 amount) external {
        require(_isminter[msg.sender]);
        _mint(toAddress, amount);
    }

	function isMinter(address minterAddress) external returns (bool) {
        return _isminter[minterAddress];
    }

    function burn(address fromAddress, uint256 amount) external {
        require(_isminter[msg.sender]);
        _burn(fromAddress, amount);
    }
}