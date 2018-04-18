var Web3 = require('web3')
var fs = require('fs');
const rpcAddress = "http://localhost:8545";
const ganacheAccounts = 50;
var candidates = [];

function listPlanets(){
  planets = [];
  console.log("getPlanets...");
  var count = contract.getPlanetCount();
  for (let i = 0; i < count; i++) {
    var planetID = contract.planetsList(i);
    planets.push(candidateID);
    var planet = contract.getPlanet(planetID);
    var name = web3.toAscii(planet[1]);
    console.log(candidateID + " - " + name + " - "  + planet[2] + " - "  + planet[3] + " - "  + planet[4]);
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

console.log("Connecting to " + rpcAddress);
web3 = new Web3(new Web3.providers.HttpProvider(rpcAddress));
// Import our contract artifacts and turn them into usable abstractions.
import artifacts from './build/contracts/ERC721Planet.json';
var Planet = artifacts.require("ERC721Planet");
console.log(Planet);
/*
contractAddress = fs.readFileSync('last_contract_address.txt').toString();
abiDefinition = fs.readFileSync('ERC721Planet-abi.txt').toString();
console.log(contractAddress);
//console.log(abiDefinition);
myContract = web3.eth.contract(JSON.parse(abiDefinition));
contract = myContract.at(contractAddress)

//listPlanets();
contract.createPlanet(1, "Earth", "Planet blue", "ipfsaddress", 10, {from: web3.eth.accounts[0], gas: 4700000});
listPlanets();
*/
console.log("Done !");
