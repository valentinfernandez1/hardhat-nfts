const { assert } = require("chai")
const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic NFT Tests", () => {
          let basicNFT
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              basicNFT = await ethers.getContract("BasicNft")
          })
          describe("constructor", () => {
              it("Verifies that the contract initializes correctly", async () => {
                  const tokenCounter = await basicNFT.getTokenCounter()

                  assert.equal(tokenCounter.toString(), "0")
              })
          })
          describe("Minting NFT Function", () => {
              it("Mints an NFT and updates properly", async () => {
                  const tx = await basicNFT.mintNft()
                  await tx.wait(1)
                  const tokenURI = await basicNFT.tokenURI(0)

                  assert.equal(tokenURI, await basicNFT.TOKEN_URI())
              })
              it("Verifies update on tokenCounter after minting", async () => {
                  const startingTokenCounter = await basicNFT.getTokenCounter()
                  const tx = await basicNFT.mintNft()
                  await tx.wait(1)
                  const endingTokenCounter = await basicNFT.getTokenCounter()

                  assert.equal(
                      endingTokenCounter.toString(),
                      startingTokenCounter.add(1).toString()
                  )
              })
          })
      })
