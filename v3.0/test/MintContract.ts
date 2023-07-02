import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import MintContract from "../artifacts/contracts/MintContract.sol/MintContract.json";
describe("MintContractAuction", () => {

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
        const maxlimit=3;
        //console.log(mint_contract.address)
        mint_contract.initialize(maxlimit);



    });

    describe("Testing Starts", () => {
        it("Mint a NFT  ", async () => {
            
            await mint_contract.safeMint(await seller.getAddress(), 0)
            //console.log('Here')
            const balance = await mint_contract.balanceOf(seller.getAddress())
            expect(balance).to.equal(1);

        });

        it("Check owner of tokenId", async () => {
            await mint_contract.safeMint(await seller.getAddress(), 0)
            const owner_address = await mint_contract.ownerOf(0)
            //console.log('Here')

            expect(owner_address).to.equal(await seller.getAddress());
        });

        it("Make sure that the number of tokens minted is less than max_limit ", async () => {
            
        await mint_contract.safeMint(await seller.getAddress(), 0)
        await mint_contract.safeMint(await seller.getAddress(), 1)
        await mint_contract.safeMint(await seller.getAddress(), 2)
        await expect( mint_contract.safeMint(await seller.getAddress(), 
        4)).to.be.rejectedWith("Maximum number of tokens already minted");
    

    });
});
});