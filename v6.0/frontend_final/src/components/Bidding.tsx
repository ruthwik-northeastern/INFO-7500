import React from 'react';
import './Bidding.css';
import { ethers } from 'ethers';
import BasicDutchAuction from "./BasicDutchAuction.json";

class Bidding extends React.Component {
    getContractInfo = async () => {
        const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner();
        
        const address = document.getElementById('contractAddress') as HTMLInputElement;

        

            const basicDutchAuction = new ethers.Contract(
                address.value.toString(),
                BasicDutchAuction.abi,
                signer
            );
            console.log(basicDutchAuction)
           

        
            

            const statusElement = document.getElementById('auctionOpen') as HTMLInputElement;
            const priceElement = document.getElementById('currentPrice') as HTMLInputElement;
            const ownerElement= document.getElementById('owner') as HTMLInputElement;
            const winnerElement= document.getElementById('Winner') as HTMLInputElement ;
            const initialPriceElement = document.getElementById('initialPriceInfo') as HTMLInputElement;
            const priceDecrementElement = document.getElementById('priceDecrementInfo') as HTMLInputElement;
            const numBlocksElement = document.getElementById('numBlocksInfo') as HTMLInputElement;
            
            
            
            const status = await basicDutchAuction.auction_open();
            const price = await basicDutchAuction.get_current_price();
            const owner = await basicDutchAuction.seller();
            const winner= await basicDutchAuction.winner();
            const initialPrice= await basicDutchAuction.reservePrice();
            const priceDecrement = await basicDutchAuction.offerPriceDecrement();
            const numBlocks = await basicDutchAuction.numBlocksAuctionOpen();

            console.log('price: ', price.toString());
            console.log('priceDecrement: ', priceDecrement.toString());
            console.log('numBlocks: ', numBlocks.toString());



           

            
            if(initialPrice!==null){
                console.log('ip');
                initialPriceElement.value=initialPrice.toString();
            }
            if(priceDecrement!==null){
                console.log('pd');
                priceDecrementElement.value=priceDecrement.toString();
            }
            if(numBlocks!==null){
                console.log('nb');
                numBlocksElement.value=numBlocks.toString();
            }

            

            if (owner!== null) {
                console.log('owner');
                ownerElement.textContent = owner;
                ownerElement.value= owner;
            }


            if (price !== null) {
                if(status===true){
                priceElement.value = price.toString(); }
                else{
                    priceElement.value = '0'; 
                }         
            }

            if (status !== null) {
                console.log('status');
                statusElement.textContent = status;
                if(status === true){
                    statusElement.value = `Auction is Open`;
                }else{
                    statusElement.value = `Auction is Closed`;
                }

            }

            if(winner!==null){
                console.log('winner');
                if(winner==='0x0000000000000000000000000000000000000000'){
                    winnerElement.value='No Winner';
                }
                else{
                    console.log('a1');
                    winnerElement.value=winner;
                    console.log('a2');
                    priceElement.value='0';
                    statusElement.value = `Auction is Closed`;

                    
                    console.log('a3');
                    console.log('Auction is Closed');

                }}

           


        
    }
    bidding= async () => {
        const biddingStatusElement = document.getElementById('biddingStatus') as HTMLInputElement;
        try{const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner();
        
        const address = document.getElementById('contractAddress') as HTMLInputElement;
        const price = document.getElementById('biddingPrice') as HTMLInputElement;
        console.log(price);
        const bidding_price=price.value;

            const basicDutchAuction = new ethers.Contract(
                address.value.toString(),
                BasicDutchAuction.abi,
                signer
            );
        const winner = await basicDutchAuction.bid({value: `${bidding_price}`});
        const winnerElement = document.getElementById('winnerHash') as HTMLInputElement;
        const winnerAddressElement = document.getElementById('winnerAddress') as HTMLInputElement;
       
        
        if(winnerElement !== null){
            winnerElement.textContent = winner;
            console.log(winner.hash)
            winnerElement.value = winner.hash;
            winnerAddressElement.value=winner.from;
            biddingStatusElement.value='Bidding Successful';
            


        }}
        catch(error:any){
            window.alert(error.reason);
            biddingStatusElement.value='Bidding Unsuccessful';



        }
        }






    render() {
        return (
        <div className="Bidding ">
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
            Winner:
            <input type="text" id="Winner" name="Winner" />
            </label>
            <br />
            <label>
            Initial Price:
            <input type="text" id="initialPriceInfo" name="initialPrice" />
            </label>
            <br />
            <label>
            Price Decrement:
            <input type="text" id="priceDecrementInfo" name="priceDecrement" />
            </label>
            <br />
            <label>
            Number of Blocks:
            <input type="text" id="numBlocksInfo" name="numBlocks" />
            </label>
            <br />
            <h1>Bid for the Auction</h1>
            <label>
            Contract Address:
            <input type="text" id="contractAddress" name="contractAddress" />
            </label>
            <br />
            <label>
            Bidding Price:
            <input type="text" id="biddingPrice" name="biddingPrice" />
            </label>
            <br />
            <button className="bid-button" onClick={this.bidding}>Bid </button>
            <br />
            <label>
            Bidding status :
            <input type="text" id="biddingStatus" name="biddingStatus" />
            </label>
            <br />

            <label>
            Winner's hash address:
            <input type="text" id="winnerHash" name="winner" />
            </label>
            <br />
            <label>
            Winner's address:
            <input type="text" id="winnerAddress" name="winnerAddress" />
            </label>


            
           

            
        </div>
        );
    }
    }

export default Bidding;