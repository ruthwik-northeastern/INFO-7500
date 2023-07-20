import React from 'react';
import './Connect.css';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

class Connect extends React.Component {
  
  connect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
  
    const accounts = await provider.listAccounts(); 
    console.log('accounts',accounts[0]);
  
    const account = document.getElementById("accountAddress") as HTMLInputElement;
    const balance = document.getElementById("balance") as HTMLInputElement;
    const chainId = document.getElementById("chainId") as HTMLInputElement;

  
    if (account) {
      account.textContent=`${accounts[0]}`;
      account.value = `${accounts[0]}`;
    }
  
    if (balance) {
      const balanceInWei = await provider.getBalance(accounts[0]);
     
      balance.value = `${balanceInWei} WEI`;
    }
  
    if (chainId) {
      const network = await provider.getNetwork();
      chainId.value = `${network.chainId}`;
      chainId.textContent = `${network.chainId}`;
    }
  };

  

  render() {
    
    return (
      
      <div className="button_and_account">
        <div><h1>Dutch Auction</h1></div>
        
        <br/>
        <button className="connect-button" onClick={this.connect}>Connect</button>
        <button className="disconnect-button">Disconnect</button>
        <h2>Account Info </h2>
        <label>
          Account Address:
          <input type="text" id="accountAddress" name="accountAddress" />
        </label>
        <br />
        <label>
          Account Balance:
          <input type="text" id="balance" name="balance" />
        </label>
        <br />
        <label>
          Account Chain id:
          <input type="text" id="chainId" name="chainId" />
        </label>
      </div>
    );
  }
}

export default Connect;
