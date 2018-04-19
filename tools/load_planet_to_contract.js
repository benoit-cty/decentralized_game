var Planet = artifacts.require("ERC721Planet");

var contract;

function listPlanets(){
  planets = [];
  console.log("getPlanets...");
  var count = contract.getPlanetCount();
  for (let i = 0; i < count; i++) {
    var planetID = contract.planetsList(i);
    planets.push(candidateID);
    var planet = contract.getPlanet(planetID);
    var name = web3.toAscii(planet[1]);
    console.log(planetID + " - " + name + " - "  + planet[2] + " - "  + planet[3] + " - "  + planet[4]);
  }
}


module.exports = function(callback) {


      Planet.deployed().then(function(instance) {
        contract=instance;

        return instance.getPlanetCount.call();
      }).then(function(balance) {
        console.log("value = " + balance.valueOf() );
      });



      Planet.deployed().then(function(instance) {
        contract=instance;

        return instance.getPlanetCount.call();
      }).then(function(balance) {
        console.log("value = " + balance.valueOf() );
      });



      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }

        var account = accounts[0];

        Planet.deployed().then(function(instance) {
          // Load planets json
          var planetsJSON = require('./planets0-100.json');
          //console.log(planetsJSON);
          console.log(planetsJSON.length);
          for (i = 0; i < planetsJSON.length; i ++) {
            console.log(planetsJSON[i].name);
            var description = planetsJSON[i].description;
            var name = planetsJSON[i].name;
            instance.createPlanet(i, name, description, "ipfsaddress", "100", {from: accounts[0]}).catch(function(err) {
              console.log("ERROR creating planet " + i + " : " + err.message);
            });
          }



            // createPlanet(uint _tokenId, bytes32 _name, string _description, bytes32 _ipfs, uint _price) public
            return instance.createPlanet(1, "PName", "PDesc", "ipfsaddress", "100", {from: accounts[0]}).then(
              function() {
                contract=instance;
                console.log(instance.getPlanetCount.call());
                listPlanets();
          })
        }).catch(function(err) {
          console.log("ERROR : " + err.message);
        });
      });



      Planet.deployed().then(function(instance) {
        contract=instance;
        listPlanets();
        return instance.getPlanetCount.call();
      }).then(function(balance) {
        console.log("value2 = " + balance.valueOf() );
      });

/*
    return Planet.deployed().then(function(instance) {
        // createPlanet(uint _tokenId, bytes32 _name, string _description, bytes32 _ipfs, uint _price) public
        return instance.createPlanet(1, "PName", "PDesc", "ipfsaddress", "100", {from: accounts[0]}).then(
          function() {
          return instance.getPlanetCount.call();
      })
      }).then(function(balance) {
        assert.equal(balance.valueOf(), 1, "Wasn't empty");
      });
*/

}
/*
var Web3 = require('web3')
var fs = require('fs');
const rpcAddress = "http://localhost:8545";
const ganacheAccounts = 50;
var candidates = [];
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
console.log("Connecting to " + rpcAddress);
web3 = new Web3(new Web3.providers.HttpProvider(rpcAddress));
// Import our contract artifacts and turn them into usable abstractions.
import artifacts from './build/contracts/ERC721Planet.json';
var Planet = artifacts.require("ERC721Planet");
console.log(Planet);
*/


























