import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import BasicDutchAuction from "../artifacts/contracts/basicDutchAutcion.sol/BasicDutchAuction.json";

describe("BasicDutchAuction", () => {
  
  let seller: Signer;
  let buyer1: Signer;
  let buyer2: Signer;
  let contract: Contract;

  beforeEach(async () => {
    [seller, buyer1, buyer2] = await ethers.getSigners();

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
      
      // Place bid from buyer1 account
      const winner = await contract.connect(buyer1).bid({ value: bidValue, gasLimit: 1000000 });
      
      // Check that the winner is set to the buyer1 account
      const winnerAddress = await winner.from;
      const buyer1Address = await buyer1.getAddress();
      expect(winnerAddress).to.equal(buyer1Address);
    });

    it("should reject a bid with value less than calculated price", async () => {
      const bidValue = 80;
      
      // Try to place a bid that is too low
      await expect(contract.connect(buyer1).bid({ value: bidValue, gasLimit: 1000000 })).to.be.rejectedWith(
        "Bid value is lower than the calculated price.");
    });

    it("should reject a bid after auction end", async () => {
      const bidValue = 210;
      
      // Place a bid from buyer1 account
      const winner = await contract.connect(buyer1).bid({ value: bidValue, gasLimit: 1000000 });
      
      // Try to place another bid from buyer2 account after auction has ended
      await expect(contract.connect(buyer2).bid({ value: 230, gasLimit: 1000000 })).to.be.rejectedWith(
        "Auction has already closed and winner has been determined.");
    });
  });
});
