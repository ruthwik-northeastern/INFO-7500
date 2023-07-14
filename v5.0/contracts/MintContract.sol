// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MintContract is Initializable, ERC721Upgradeable {
  
    uint256 public maxTokens; // maximum number of tokens that can be minted
    uint256 public count;
    function initialize(uint256 _maxTokens) initializer public {
        __ERC721_init("MintContract", "MTK");
       
        maxTokens = _maxTokens;
        count = 0;
    }

    function safeMint(address to, uint256 tokenId)
        public
        // onlyOwner
    {    require(count < maxTokens, "Maximum number of tokens already minted");
        _safeMint(to, tokenId);
        
        count=count+1;
    }

    // The following functions are overrides required by Solidity.

    

    
}