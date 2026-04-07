const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const artifact = require("../abi/DocumentVerification.json");

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  artifact.abi,
  wallet,
);

async function storeHashOnChain(hash) {
  const tx = await contract.storeHash(hash);
  await tx.wait();
  return tx.hash;
}

async function verifyHashOnChain(hash) {
  return await contract.verifyHash(hash);
}

module.exports = {
  storeHashOnChain,
  verifyHashOnChain,
};
