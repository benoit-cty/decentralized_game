var Web3 = require('web3')
var fs = require('fs');
// var async = require('asyncawait/async');
// var await = require('asyncawait/await');
const rpcAddress = "http://localhost:8545";
console.log("Connecting to " + rpcAddress);
web3 = new Web3(new Web3.providers.HttpProvider(rpcAddress));

//web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//contractInstance = VotingContract.at(deployedContract.address);
function saveContractAddress(contractAddress){
  fs.writeFile("last_contract_address.txt", contractAddress, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("last_contract_address.txt was saved!");
  });
  console.log("\nContract" + contractAddress + "\nDone!");
}

// We need to wait until any miner has included the transaction
// in a block to get the address of the contract
async function waitBlock() {
  while (true) {
    let receipt = web3.eth.getTransactionReceipt(deployedContract.transactionHash);
    if (receipt && receipt.contractAddress) {
      console.log("Your contract has been deployed at http://testnet.etherscan.io/address/" + receipt.contractAddress);
      console.log("Note that it might take 30 - 90 sceonds for the block to propagate befor it's visible in etherscan.io");
      saveContractAddress(receipt.contractAddress);
      break;
    }
    console.log("Waiting a mined block to include your contract... currently in block " + web3.eth.blockNumber);
    await sleep(4000);
  }
}

function compil(filename){

}

function findImports (path) {
	if (path === 'SimpleERC721.sol'){
    code = fs.readFileSync('./SimpleERC721.sol').toString();
		return { contents: code }
	}else{
		return { error: 'File not found' }
    }
}



code = fs.readFileSync('./ERC721Planet.sol').toString();
solc = require('solc');
console.log("Compiling...");
//compiledCode = solc.compile(code);
var input = {
	'ERC721Planet.sol': code
}
var output = solc.compile({ sources: input }, 1, findImports)
console.log(output);
for (var contractName in output.contracts) {
  console.log('Saving : ' + contractName.split(':')[0]);
  // output.contracts[contractName].bytecode
  myContract = web3.eth.contract(JSON.parse(output.contracts[contractName].interface));
  deployedContract = myContract.new({data: output.contracts[contractName].bytecode, from: web3.eth.accounts[0], gas: 4700000});
  fs.writeFile(contractName.split(':')[1] + "-abi.txt", output.contracts[contractName].interface, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("contract was saved!");
  });
}

waitBlock();
