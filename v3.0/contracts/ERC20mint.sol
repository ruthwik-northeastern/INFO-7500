// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KToken is ERC20 {
    
    uint256 immutable maxSupply;
    constructor(uint256 _maxSupply) ERC20("KToken", "KT") {
        maxSupply=_maxSupply;
    }

    function mint(address to, uint256 amount) public  {
        uint256  total=totalSupply();
        
        require((total+amount)<maxSupply,"Circular should be less than max supply");
        _mint(to, amount);
    }
}