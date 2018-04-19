var Spaceship = artifacts.require("ERC721SpaceShip");

var contract;

function listSpaceShips(){
  spaceships = [];
  console.log("getSpaceShips...");
  var count = contract.getSpaceShipCount();
  for (let i = 0; i < count; i++) {
    var spaceshipID = contract.spaceshipsList(i);
    spaceships.push(candidateID);
    var spaceship = contract.getSpaceShip(spaceshipID);
    var name = web3.toAscii(SpaceShip[1]);
    console.log(spaceshipID + " - " + name + " - "  + spaceship[2] + " - "  + spaceship[3] + " - "  + spaceship[4]);
  }
}


module.exports = function(callback) {


      Spaceship.deployed().then(function(instance) {
        contract=instance;

        return instance.getSpaceShipCount.call();
      }).then(function(balance) {
        console.log("value = " + balance.valueOf() );
      });



      Spaceship.deployed().then(function(instance) {
        contract=instance;

        return instance.getSpaceShipCount.call();
      }).then(function(balance) {
        console.log("value = " + balance.valueOf() );
      });



      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }

        var account = accounts[0];

        Spaceship.deployed().then(function(instance) {
          // Load planets json
          var spaceshipsJSON = require('./spaceships.json');
          //console.log(planetsJSON);
          console.log("info should load here...");
          console.log(spaceshipsJSON.length);
          for (i = 0; i < spaceshipsJSON.length; i ++) {
            console.log(spaceshipsJSON[i].name);
            var type = spaceshipsJSON[i].type;
            var name = spaceshipsJSON[i].name;
            instance.createSpaceShip(i, name, type, "ipfsaddress", "100", "50", "20", {from: accounts[0]}).catch(function(err) {
              console.log("ERROR creating spaceship " + i + " : " + err.message);
            });
          }



            // createPlanet(uint _tokenId, bytes32 _name, string _description, bytes32 _ipfs, uint _price) public
            return instance.createSpaceShip(1, "SSName", "SStypeOfShip", "ipfsaddress", "100", "50", "20", {from: accounts[0]}).then(
              function() {
                contract=instance;
                console.log(instance.getSpaceShipCount.call());
                listSpaceShips();
                console.log("or here");
          })
        }).catch(function(err) {
          console.log("ERROR : " + err.message);
        });
      });



      Spaceship.deployed().then(function(instance) {
        contract=instance;
        listSpaceShips();
        return instance.getSpaceShipCount.call();
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

