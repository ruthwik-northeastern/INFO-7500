// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract KToken is ERC20,ERC20Permit {
    
    uint256 immutable maxSupply;
    constructor(uint256 _maxSupply) ERC20("KToken", "KT") ERC20Permit("KToken"){
        maxSupply=_maxSupply;
    }

    function mint(address to, uint256 amount) public  {
        uint256  total=totalSupply();
        
        require((total+amount)<maxSupply,"Circular should be less than max supply");
        _mint(to, amount);
    }


}

