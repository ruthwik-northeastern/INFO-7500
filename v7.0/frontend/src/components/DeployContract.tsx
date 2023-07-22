import React from 'react';
import './DeployContract.css';
import { ethers } from 'ethers';
import BasicDutchAuction from "./BasicDutchAuction.json";
class DeployContract extends React.Component {

  deployContract = async () => {
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const BasicDutch= new ethers.ContractFactory( BasicDutchAuction.abi, BasicDutchAuction.bytecode, signer);

    

        const basePriceInput = document.getElementById("initialPrice") as HTMLInputElement;
        const numBlocksInput = document.getElementById("numBlocks") as HTMLInputElement;
        const decrementInput = document.getElementById("priceDecrement") as HTMLInputElement;
        
      

        const basePrice = basePriceInput.value;
        const numBlocks = numBlocksInput.value;
        const decrement = decrementInput.value;

        

        const deployed = document.getElementById("deployAddress") as HTMLInputElement;

        const basicDutchAuction = await BasicDutch.deploy(basePrice,numBlocks,decrement);
        await basicDutchAuction.deployed();
        const deployedAddress = basicDutchAuction.address;

        window.alert(`Contract deployed to: ${deployedAddress}`);
        deployed.textContent = `${deployedAddress}`;
        deployed.value = `${deployedAddress}`;

    
};




  render() {
    return (
      <div className="DeployContract">
        <h1>Deploy Contract</h1>
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
        <button className="deploy-button" onClick={this.deployContract}>Deploy Contract</button>
        <br />
        
        <label>
          Contract Deployed at:
          <input type="text" id="deployAddress" name="deployAddress" />
        </label>
        
      </div>
    );
  }
}

export default DeployContract;
