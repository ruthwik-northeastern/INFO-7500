import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import KToken from "../artifacts/contracts/ERC20mint.sol/KToken.json";

describe("KTokenContract", () => {
    let seller: Signer;
    let buyer: Signer;
    let contract: Contract;
    let ktoken_contract: Contract;
    
    beforeEach(async () => {
            [seller, buyer] = await ethers.getSigners();
    
            const KTokenFactory = new ContractFactory(KToken.abi, KToken.bytecode,
                seller);
            //console.log(seller.getAddress())
            ktoken_contract = await KTokenFactory.deploy(1000)
            
            //console.log(mint_contract.address)
         });

         describe("Testing Starts", () => {
            it("Check total supply before Minting", async () => {
                
                const supply=await ktoken_contract.totalSupply()
                //console.log('Here')
                expect(supply).to.equal(0);
    
            });
    
            it("Check total supply after Minting", async () => {
                const tokens_minted=600;
                await ktoken_contract.mint(buyer.getAddress(),tokens_minted)
                const totalSupply= await ktoken_contract.totalSupply();
                //console.log('Here')
    
                expect(totalSupply).to.equal(tokens_minted);
            
            });

            it("Checking owner of Minted tokens", async () => {
                const tokens_minted=600;
                await ktoken_contract.mint(buyer.getAddress(),tokens_minted)
                const balance= await ktoken_contract.balanceOf(buyer.getAddress());
                //console.log('Here')
    
                expect(balance).to.equal(tokens_minted);
            
            });

            it("Checking whether the circular supply of tokens minted exceeded the max supply",async() => {
                const tokens_minted=600;
                await ktoken_contract.mint(buyer.getAddress(),tokens_minted)
                await expect (ktoken_contract.mint(buyer.getAddress(),
                tokens_minted)).to.be.rejectedWith("Circular should be less than max supply");
            });

            it("Checking whether the user wants to mint coins more than maxlimit",async() => {
                const tokens_minted=1600;
                await expect (ktoken_contract.mint(buyer.getAddress(),
                tokens_minted)).to.be.rejectedWith("Circular should be less than max supply");
            });

            it("Checking when the total is equal to max supply",async() => {
                await ktoken_contract.mint(seller.getAddress(), 900);
               // await ktoken_contract.mint(seller.getAddress(), 100);
                await expect(ktoken_contract.mint(buyer.getAddress(), 100)).to.be.rejectedWith("Circular should be less than max supply");
       
        });

    
    });
    
    });