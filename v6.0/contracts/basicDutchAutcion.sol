//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract BasicDutchAuction {
    // Address of the seller who created the auction
    address public seller;
    // Reserve price set by the seller
    uint256 public reservePrice;
    // Number of blocks the auction will be open
    uint256 public numBlocksAuctionOpen;
    // Price decrement per block
    uint256 public offerPriceDecrement;
    // Initial price set by the auction
    uint256 public initialPrice;
    // Current price of the auction
    uint256 public currentPrice;
    // Address of the winning bidder
    address public winner;
    // Block number when the auction will end
    uint256 public auctionEndBlock;

    bool private auctionClosed; 

  
    constructor(
        uint256 _reservePrice,
        uint256 _numBlocksAuctionOpen,
        uint256 _offerPriceDecrement
    ) {
        // Set the address of the seller who created the auction
        seller = msg.sender;
        // Set the reserve price
        reservePrice = _reservePrice;
        // Set the number of blocks the auction will be open
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        // Set the price decrement per block
        offerPriceDecrement = _offerPriceDecrement;
        // Calculate the initial price as the sum of the reserve price and the total price decrement
        initialPrice =
            reservePrice +
            numBlocksAuctionOpen *
            offerPriceDecrement;
        // Set the current price as the initial price
        currentPrice = initialPrice;
        // Set the block number when the auction will end
        auctionEndBlock = block.number + numBlocksAuctionOpen;
        auctionClosed = false;
    }

    /**
     * Function to place a bid in the auction
     */
    function bid() public payable returns(address){
        // Check if the auction has already ended
        require(block.number <= auctionEndBlock, "Auction has already ended.");

        // Define the current price based on the block
        uint256 calculatedPrice = initialPrice -
            (block.number - (auctionEndBlock - numBlocksAuctionOpen)) *
            offerPriceDecrement;
        // Check if the bid value is greater than or equal to the calculated price
        require(
            msg.value >= calculatedPrice,
            "Bid value is lower than the calculated price."
        );
        require(auctionClosed==false,"Auction has already closed and winner has been determined.");
        require(msg.sender!=seller,"Seller cannot bid on his own auction.");
        // Set the winning bidder
        winner = msg.sender;
        auctionClosed=true;
        // Transfer the bid value to the seller
        payable(seller).transfer(msg.value);
        
        return winner;
    }
    function auction_open() public view returns(bool){
        if(block.number <= auctionEndBlock){
            return true;
        }
        else{
            return false;
        }
    }
    function get_current_price() public view returns(uint256){
        uint256 calculatedPrice = initialPrice -
            (block.number - (auctionEndBlock - numBlocksAuctionOpen)) *
            offerPriceDecrement;
        return calculatedPrice;
    }
}