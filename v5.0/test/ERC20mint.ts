import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer,Wallet, BigNumber } from "ethers";
import KTokenfile from "../artifacts/contracts/ERC20mint.sol/KToken.json";
import {KToken} from "../typechain-types";
import NFTDutchAuction_ERC20Bids from "../artifacts/contracts/NFTDutchAuction_ERC20Bids.sol/NFTDutchAuction_ERC20Bids.json";
import MintContract from "../artifacts/contracts/MintContract.sol/MintContract.json";


async function getPermitSignature(signer:any, token:Contract, spender:string, value:BigNumber, deadline:BigNumber) {

    const [nonce, name, version, chainId] = await Promise.all([
        token.nonces(signer.address),
        token.name(),
        "1",
        signer.getChainId(),
    ])

    return ethers.utils.splitSignature(
        await signer._signTypedData(
            {
                name,
                version,
                chainId,
                verifyingContract: token.address,
            },
            {
                Permit: [
                    {
                        name: "owner",
                        type: "address",
                    },
                    {
                        name: "spender",
                        type: "address",
                    },
                    {
                        name: "value",
                        type: "uint256",
                    },
                    {
                        name: "nonce",
                        type: "uint256",
                    },
                    {
                        name: "deadline",
                        type: "uint256",
                    },
                ],
            },
            {
                owner: signer.address,
                spender,
                value,
                nonce,
                deadline,
            }
        )
    )
}


describe("KTokenContract", () => {
    let seller: Signer;
    let buyer: Signer;
    let contract: Contract;
    let ktoken_contract: Contract;

    beforeEach(async () => {
            [seller, buyer] = await ethers.getSigners();
    
            const KTokenFactory = new ContractFactory(KTokenfile.abi, KTokenfile.bytecode,
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
        it("token Allowance Check", async function () {
            let mint_contract: Contract;
            const MintFactory = new ContractFactory(MintContract.abi, MintContract.bytecode,
                seller);
    
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
           
            const deadline = ethers.constants.MaxUint256;
            const amount = BigNumber.from(1000);
            const { v, r, s } = await getPermitSignature(
                seller,
                ktoken_contract,
                contract.address,
                amount,
                deadline
            )
        await expect(ktoken_contract.permit(seller.getAddress(),contract.address,
        100,deadline,v,r,s)).to.be.revertedWith("ERC20Permit: invalid signature")
        


        });

        it("token Allowance Check", async function () {
            let mint_contract: Contract;
            const MintFactory = new ContractFactory(MintContract.abi, MintContract.bytecode,
                seller);
    
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
           
            const deadline = ethers.constants.MaxUint256;
            const amount = BigNumber.from(1000);
            const { v, r, s } = await getPermitSignature(
                seller,
                ktoken_contract,
                contract.address,
                amount,
                deadline
            )
        await (ktoken_contract.permit(seller.getAddress(),contract.address,amount,deadline,v,r,s));
        


        });




          

    
    });
});
    
  