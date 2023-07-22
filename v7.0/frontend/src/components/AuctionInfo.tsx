import React from 'react';
import './AuctionInfo.css';
import { ethers } from 'ethers';
import BasicDutchAuction from "./BasicDutchAuction.json";
 
class AuctionInfo extends React.Component {
    getContractInfo = async () => {
        const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner();
        
        const address = document.getElementById('contractAddress') as HTMLInputElement;

        

            const basicDutchAuction = new ethers.Contract(
                address.value.toString(),
                BasicDutchAuction.abi,
                signer
            );
            console.log(basicDutchAuction)
            const status = await basicDutchAuction.auction_open();
            const price = await basicDutchAuction.initialPrice();
            const owner = await basicDutchAuction.seller();
            const initialPrice = await basicDutchAuction.reservePrice();
            const priceDecrement = await basicDutchAuction.offerPriceDecrement();
            const numBlocks = await basicDutchAuction.numBlocksAuctionOpen();

            


            

            const statusElement = document.getElementById('auctionOpen') as HTMLInputElement;
            const priceElement = document.getElementById('currentPrice') as HTMLInputElement;
            const ownerElement= document.getElementById('owner') as HTMLInputElement;
            const initialPriceElement = document.getElementById('initialPrice') as HTMLInputElement;
            const priceDecrementElement = document.getElementById('priceDecrement') as HTMLInputElement;
            const numBlocksElement = document.getElementById('numBlocks') as HTMLInputElement;
            
            console.log('statusElement: ', statusElement);
            console.log('priceElement: ', priceElement);
            console.log('ownerElement: ', ownerElement);
            console.log('initialPriceElement: ', initialPriceElement);
            console.log('priceDecrementElement: ', priceDecrementElement);
            console.log('numBlocksElement: ', numBlocksElement);

            

            if (ownerElement !== null) {
                ownerElement.textContent = owner;
                ownerElement.value= owner;
            }


            if (priceElement !== null) {
                if(status===true){
                priceElement.textContent = price;
                priceElement.value = price;}
                else{
                    priceElement.textContent = "0";
                    priceElement.value = "0";
                }
            }

            if (statusElement !== null) {
                statusElement.textContent = status;
                if(status === true){
                    statusElement.value = `Auction is Open`;
                }else{
                    statusElement.value = `Auction is Closed`;
                }

            }

            if(initialPriceElement !== null){
                console.log('here');
               
                initialPriceElement.value = initialPrice;
            }
            if(priceDecrementElement !== null){
               
                priceDecrementElement.value = priceDecrement;
            }
            if(numBlocksElement !== null){
                
                numBlocksElement.value = numBlocks;
            }


        
    }
   


    render() {
        return (
        <div className="AuctionInfo">
            <h1>Auction Info</h1>
            <label>
            Contract Address:
            <input type="text" id="contractAddress" name="contractAddress" />
            </label>
            <br />
            <button className="address-button" onClick={this.getContractInfo}>Contract Info</button>
            <br />
            <label>
            Current Price:
            <input type="text" id="currentPrice" name="currentPrice" />
            </label>
            <br />
            <label>
            Auction Status:
            <input type="text" id="auctionOpen" name="auctionOpen" />
            </label>
            <br />
            <label>
            Owner:
            <input type="text" id="owner" name="owner" />
            </label>
            <br />
            <label>
            Initial Price:
            <input type="text" id="initialPrice" name="initialPrice" />
            </label>
            <br />
            <label>
            Price Decrement:
            <input type="text" id="priceDecrement" name="priceDecrement" />
            </label>
            <br />
            <label>
            Number of Blocks:
            <input type="text" id="numBlocks" name="numBlocks" />
            </label>
            <br />
            
        

            
        </div>
        );
    }
    }
export default AuctionInfo;