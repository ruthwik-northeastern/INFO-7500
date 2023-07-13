import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import "@openzeppelin/hardhat-upgrades";
import { Contract, ContractFactory, Signer } from "ethers";
import NFTDutchAuction_ERC20Bids from "../artifacts/contracts/NFTDutchAuction_ERC20Bids.sol/NFTDutchAuction_ERC20Bids.json"
import MintContract from "../artifacts/contracts/MintContract.sol/MintContract.json";
import KToken from "../artifacts/contracts/ERC20mint.sol/KToken.json";

describe("NFTDutchAuction_ERC20", () => {

    let seller: Signer;
    let buyer: Signer;
    let contract: Contract;
    let mint_contract: Contract;
    let ktoken_contract: Contract;

   
        beforeEach(async () => {
            [seller, buyer] = await ethers.getSigners();
        
            const KTokenFactory = new ContractFactory(KToken.abi, KToken.bytecode,
                seller);
            const MintFactory = new ContractFactory(MintContract.abi, MintContract.bytecode,
                seller);
    
            ktoken_contract = await KTokenFactory.deploy(1000)
            mint_contract = await MintFactory.deploy()
    
            mint_contract.initialize(5);
    
            const NFTDutchAuction_ERC20BidsFactory = await ethers.getContractFactory("NFTDutchAuction_ERC20Bids");
            contract = await upgrades.deployProxy(
                NFTDutchAuction_ERC20BidsFactory,
                [ktoken_contract.address, mint_contract.address, 0, 100, 5, 10],
                {
                    kind: "uups",
                    initializer: "initialize(address, address,uint256,uint256,uint256,uint256)",
                    seller
                }
            );
        });



    describe("Placing bid", () => {
        it("Not allowed to bid if the user doesn't have the the required allowance", async () => {
            await expect(contract.bid(600)).to.be.rejectedWith("ERC20: insufficient allowance");
        });
        it("Reject a bid if bid price is less than initial price ", async () => {
            await mint_contract.safeMint(await seller.getAddress(), 0)

            await mint_contract.approve(contract.address, 0)


            await ktoken_contract.mint(buyer.getAddress(), 200)

            await ktoken_contract.connect(buyer).approve(contract.address, 600);
            console.log('Here');
            await expect(contract.functions.bid(50)).to.be.rejectedWith("Bid value is less than current price.");


        });


        it("Should throw an error if bidding is attempted after auction is closed", async () => {
            // Increase the number of blocks to close the auction
            await ethers.provider.send("evm_increaseTime", [1001]);
            await ethers.provider.send("evm_mine", []);

            // Mint NFT and approve auction contract
            await mint_contract.safeMint(await seller.getAddress(), 0);
            await mint_contract.approve(contract.address, 0);

            // Mint KTokens and approve auction contract
            await ktoken_contract.mint(buyer.getAddress(), 200);
            await ktoken_contract.connect(buyer).approve(contract.address, 600);

            // Place a bid after the auction has been closed
            await expect(contract.functions.bid(600)).to.be.rejectedWith("Auction has already ended. No more bids");
        });
        it("should reject a bid if auction is closed", async () => {
            // Close the auction
            //console.log(contract)

            await contract.closeAuction();

            // Mint a token for the seller and approve the contract to sell it
            await mint_contract.safeMint(await seller.getAddress(), 0);
            await mint_contract.approve(contract.address, 0);

            // Approve the contract to spend some KToken on behalf of the buyer
            await ktoken_contract.mint(buyer.getAddress(), 200);
            await ktoken_contract.connect(buyer).approve(contract.address, 600);

            // Try to place a bid on the closed auction
            await expect(contract.functions.bid(600)).to.be.rejectedWith("Auction has already ended. No more bids");
        });

        it("Auction can't be closed by anyone other than seller", async () => {
            // Close the auction
            //console.log(contract)
            await expect(contract.connect(buyer).closeAuction()).to.be.rejectedWith("Only the seller can close the auction");

        });






    });




});
