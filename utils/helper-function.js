const ethers = require("ethers")
const { ABI } = require("../constants/constants")
const Tasks = require("../models/Tasks")
const dotenv = require("dotenv")

dotenv.config()

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS_ENCRYPTED;
const PRIVATE_KEY = process.env.PRIVATE_KEY_ENCRYPTED;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL_ENCRYPTED;
const provider = new ethers.providers.WebSocketProvider(GOERLI_RPC_URL);

const getContract = async (signerRequired = false) => {
  // console.log(contractAddress[ch ainId]);

  const provider = new ethers.providers.WebSocketProvider(GOERLI_RPC_URL);
  if (signerRequired) {
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    return contract;
  } else {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    return contract;
  }
};
const listenToTaskCancellation = async () => {
  console.log("listenting to events")
  const contract = await getContract(true)

  contract.on("AutoTaskCancelled", async (taskAddress, balance, owner) => {
    console.log("event emitted")
    console.log(balance.toString())
    const task = await Tasks.findOne({ address: taskAddress?.toString() })
    const provider = new ethers.providers.WebSocketProvider(GOERLI_RPC_URL);
    const signer = new ethers.Wallet(task.executorkey, provider)
    // const bal = ethers.utils.formatEther(balance.toString())
    const gasPrice = await provider.getGasPrice()
    console.log(`gasprice ${ethers.utils.formatEther(gasPrice)}`)
    const gas = await contract.estimateGas.depositeFunds({ value: ethers.utils.parseEther("0.0045"), gasLimit: 70000 });
    const tx = await contract.depositeFunds({ value: balance, gasLimit: 70000 })
    const receipt = await tx.wait(1);
    console.log(`https://goerli.etherscan.io/tx/${tx.hash}`)
    const { gasUsed, effectiveGasPrice } = receipt
    console.log(`gas : ${gasUsed.toString()}`)
    console.log(ethers.utils.formatEther(gasUsed.mul(effectiveGasPrice)).toString())
    await task.delete();
    console.log("done")
  })
}


const checkAutomation = async () => {
  const unSignedContract = await getContract(false);
  const tasks = await unSignedContract.getAllTasks();
  console.log(tasks.length)
  for (let i = 0; i < tasks.length; i++) {
    const status = await unSignedContract.getStatus(tasks[i].taskAddress)
    console.log(`status of ${i + 1} : ${status}`)
    if (status) {
      try {
        const gasLimit = parseInt(tasks[i].gasLimit.toString())
        const id = parseInt(tasks[i].id.toString())
        const contract = await getContract(true);
        const gas = await contract.estimateGas.execute(id)
        const gasPrice = await provider.getGasPrice()
        const gasCost = gas.mul(gasPrice);
        const price = parseFloat(ethers.utils.formatEther(gasCost).toString())
        const balance = parseFloat(ethers.utils.formatEther(tasks[i].funds).toString())
        if ((parseInt(gas.toString()) < parseInt(tasks[i].gasLimit.toString())) && balance > price) {
          const tx = await contract.execute(id, { gasLimit: gasLimit })
          const receipt = await tx.wait(1)
          const { gasUsed,effectiveGasPrice } = receipt
          console.log(gasUsed.toString())
          if(gasUsed){
            const amount = gasUsed.mul(effectiveGasPrice)
            const tx1 = await contract.updateTaskExecDetails(id,amount,{gasLimit:100000})
            const rec = await tx1.wait(1)
            console.log(rec.gasUsed.toString())
          }
        }

      } catch (error) {
        console.log(error)
      }
    }
  }
  checkAutomation()
}

module.exports = { listenToTaskCancellation, checkAutomation }
