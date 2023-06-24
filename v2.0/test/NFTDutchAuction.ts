import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import NFTDutchAuction from "../artifacts/contracts/NFTDutchAuction.sol/NFTDutchAuction.json";
import MintContract from "../artifacts/contracts/MintContract.sol/MintContract.json";
describe("NFTDutchAuction", () => {

    let seller: Signer;
    let buyer: Signer;
    let contract: Contract;
    let mint_contract: Contract;

    beforeEach(async () => {
        [seller, buyer] = await ethers.getSigners();

        const MintFactory = new ContractFactory(MintContract.abi, MintContract.bytecode,
            seller);
        //console.log(seller.getAddress())
        mint_contract = await MintFactory.deploy()
        //console.log(mint_contract.address)
        mint_contract.initialize(5);
        
        //console.log('Here')
        

        const NFTcontractFactory = new ContractFactory(
            NFTDutchAuction.abi,
            NFTDutchAuction.bytecode,
            seller
        );
        //console.log('Seller')
        //console.log(seller.getAddress())
        contract = await NFTcontractFactory.deploy(mint_contract.address, 0, 100, 10, 10);

    });

    describe("Bid", () => {
        it("Checking winner if he places the right bid", async () => {
            const bidValue = 210;
            await mint_contract.safeMint(await seller.getAddress(), 0)
            await contract.setMintContract(mint_contract.address)
            await mint_contract.approve(contract.address, 0)

            const winner = await contract.functions.bid({ value: bidValue, gasLimit: 1000000 });

            const seller_address = await seller.getAddress();
            expect(winner.from).to.equal(seller_address);
        });

        it("should reject a bid with value less than calculated price", async () => {
            const bidValue = 80;
            await mint_contract.safeMint(await seller.getAddress(), 0)
            await contract.setMintContract(mint_contract.address)
            await mint_contract.approve(contract.address, 0)

            await expect(contract.functions.bid({ value: bidValue, gasLimit: 1000000 })).to.be.rejectedWith(
                "Bid value is less than current price.");
        });



        it("should reject a bid after auction end", async () => {
            const bidValue = 210;
            await mint_contract.safeMint(await seller.getAddress(), 0)
            await contract.setMintContract(mint_contract.address)
            await mint_contract.approve(contract.address, 0)

            const winner = await contract.functions.bid({ value: bidValue });
            const winner2 = await expect(contract.functions.bid({ value: 230})).to.be.rejectedWith(
                "Winner has been chosen. No more bidding. Auction closed");;

        });
    });
});