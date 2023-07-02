// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface IMintContract {
function safeTransferFrom(address from, address to, uint256 tokenId)external;
}
interface IERC20Mint{
function transferFrom(address from, address to, uint256 amount)external returns(bool);
}

contract NFTDutchAuction_ERC20Bids is Initializable
{
// Declare all the required variables

uint256 private reservePrice; // Minimum price for the NFT
uint256 private numBlocksAuctionOpen; // Number of blocks that the auction should remain open
uint256 private offerPriceDecrement; // Price decrement for each block after reserve price
uint256 public initialPrice; // Initial price of the auction
address public seller; // Address of the seller
address public auction_winner; // Address of the winning bidder
uint256 public auctionEnd; // Block number when the auction ends
bool public auctionClosed; // Flag to indicate if auction is closed or not
uint256 private nftTokenId; // Token ID of the NFT to be auctioned
uint256 public currentPrice; // Current price of the auction
address public erc721TokenAddress; // Address of the NFT contract
address public erc20TokenAddress; // Address of the ERC20 token contract
  
 IERC20Mint mintERC20;
 IMintContract mintContract;
// Constructor to initialize the auction
constructor(
    address _erc20TokenAddress,
    address _erc721TokenAddress,
    uint256 _nftTokenId,
    uint256 _reservePrice,
    uint256 _numBlocksAuctionOpen,
    uint256 _offerPriceDecrement

) {
    erc20TokenAddress = _erc20TokenAddress;
    erc721TokenAddress = _erc721TokenAddress;
    nftTokenId = _nftTokenId;
    reservePrice = _reservePrice;
    numBlocksAuctionOpen = _numBlocksAuctionOpen;
    offerPriceDecrement = _offerPriceDecrement;
    initialPrice = reservePrice + numBlocksAuctionOpen * offerPriceDecrement;
    currentPrice = initialPrice;
    auctionEnd = block.number + numBlocksAuctionOpen;
    auctionClosed = false;
    seller = msg.sender;
    mintERC20=IERC20Mint(erc20TokenAddress);
    mintContract=IMintContract(erc721TokenAddress);
}



// Function to place a bid on the auction
function bid(uint256 _bidAmount) public returns (address) {
    require(block.number <= auctionEnd, "Auction has already ended. No more bids"); // Check if the auction is still open
    require(_bidAmount >= reservePrice, "Bid value is less than current price."); // Check if the bid amount is sufficient
    require(auctionClosed == false, "Winner has been chosen. No more bidding. Auction closed"); // Check if the auction is closed or not

    auction_winner = msg.sender; // Update the address of the winning bidder
    initialPrice = 0; // Set the initial price to zero
    auctionClosed = true; // Mark the auction as closed

    mintERC20.transferFrom(msg.sender, seller, _bidAmount); // Transfer the bid amount to this contract
    mintContract.safeTransferFrom(seller, auction_winner, nftTokenId); // Transfer the NFT to the winning bidder
    return auction_winner; // Return the address of the winning bidder
}
function closeAuction() public {
    require(msg.sender == seller, "Only the seller can close the auction");
    
    
    auctionClosed = true;
}

}

