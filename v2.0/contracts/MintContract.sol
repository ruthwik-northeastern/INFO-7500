// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Import necessary OpenZeppelin libraries
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MintContract is Initializable, ERC721Upgradeable, OwnableUpgradeable {
  
    // Define public variables
    uint256 public maxTokens; // maximum number of tokens that can be minted
    uint256 public count; // current number of tokens that have been minted
    
    function initialize(uint256 _maxTokens) initializer public {
        // Initialize the contract
        __ERC721_init("MintContract", "MTK");
        // __ERC721URIStorage_init();
        __Ownable_init();
        
        // Set the maximum number of tokens that can be minted
        maxTokens = _maxTokens;
        
        // Set the initial count to 0
        count = 0;
    }

    function safeMint(address to, uint256 tokenId)
        public
        // onlyOwner - this modifier has been commented out
    {   
        // Check if the maximum number of tokens has already been minted
        require(count < maxTokens, "Maximum number of tokens already minted");
        
        // Mint the token to the specified address and set its URI
        _safeMint(to, tokenId);
        // _setTokenURI(tokenId, uri);
        
        // Increment the count of tokens that have been minted
        count = count + 1;
    }

    // The following functions are overrides required by Solidity.

    // function _burn(uint256 tokenId)
    //     internal
    //     override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    // {
    //     // Call the parent _burn function
    //     super._burn(tokenId);
    // }

    // function tokenURI(uint256 tokenId)
    //     public
    //     view
    //     override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    //     returns (string memory)
    // {
    //     // Call the parent tokenURI function
    //     return super.tokenURI(tokenId);
    // }
}
