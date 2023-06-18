import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import BasicDutchAuction from "../artifacts/contracts/BasicDutchAuction.sol/BasicDutchAuction.json";

describe("BasicDutchAuction", () => {
  
  let seller: Signer;
  let buyer: Signer;
  let contract: Contract;

  beforeEach(async () => {
    [seller, buyer] = await ethers.getSigners();

    const contractFactory = new ContractFactory(
      BasicDutchAuction.abi,
      BasicDutchAuction.bytecode,
      seller
    );

    contract = await contractFactory.deploy(100, 10, 10);
  });

  describe("Bid", () => {
    it("should place a bid", async () => {
      const bidValue = 210;
      const winner=await contract.functions.bid({ value: bidValue ,gasLimit: 1000000});
      
      //const winnerSigner = ethers.provider.getSigner(winner[0]);

      const seller_address = await seller.getAddress();
      expect(winner.from).to.equal(seller_address);
    });

    it("should reject a bid with value less than calculated price", async () => {
      const bidValue = 80;
      await expect(contract.functions.bid({ value: bidValue ,gasLimit: 1000000})).to.be.rejectedWith(
        "Bid value is lower than the calculated price.");
      });



    it("should reject a bid after auction end", async () => {
      const bidValue = 210;
      const winner=await contract.functions.bid({ value: bidValue ,gasLimit: 1000000});
      
      const winner2=await expect(contract.functions.bid({ value: 230 ,gasLimit: 1000000})).to.be.rejectedWith(
        "Auction has already closed and winner has been determined.");;

      });
      });

  

});
