const ethers = require("ethers")
const { ABI } = require("../constants/constants")
const dotenv = require("dotenv")

dotenv.config()

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS_ENCRYPTED;
const PRIVATE_KEY = process.env.PRIVATE_KEY_ENCRYPTED;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL_ENCRYPTED;

const getContract = async (signerRequired = false) => {
  // console.log(contractAddress[ch ainId]);

  const provider = new ethers.providers.WebSocketProvider(GOERLI_RPC_URL);
  if (signerRequired) {
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    return contract;
  } else {
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    return contract;
  }
};
 const listenToTaskCancellation = async() => {
    console.log("listenting to events")
    const contract = await getContract()
    contract.on("AutoTaskCancelled",async(taskAddress,balance,owner) => {
      const bal = ethers.formatEther(balance.toString()).toString();
      const amount = ethers.parseEther(bal)  
      const tx = contract.depositFundsToContract({value:amount,gasLimit:70000})
      const receipt = await tx.wait(1);
      const { gasUsed, effectiveGasPrice } = receipt
      console.log(ethers.formatEther(gasUsed.mul(effectiveGasPrice)).toString())
    })
}

module.exports = { listenToTaskCancellation}
