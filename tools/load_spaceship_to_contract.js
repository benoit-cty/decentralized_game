var Spaceship = artifacts.require("ERC721SpaceShip");

var fs = require('fs');
var contract;
//
// function listSpaceShips(){
//   spaceships = [];
//   console.log("getSpaceShips...");
//   var count = contract.getSpaceShipCount();
//   if(count > 50) count = 5;
//   for (let i = 0; i < count; i++) {
//     var spaceshipID = contract.spaceshipsList(i);
//     spaceships.push(candidateID);
//     var spaceship = contract.getSpaceShip(spaceshipID);
//     var name = web3.toAscii(SpaceShip[1]);
//     console.log(spaceshipID + " - " + name + " - "  + spaceship[2] + " - "  + spaceship[3] + " - "  + spaceship[4]);
//   }
// }

function readLines(input) {
  return new Promise(function (resolve, reject) {
    var remaining = '';

    input.on('data', function (data) {
      remaining += data;
      var index = remaining.indexOf('\n');
      while (index > -1) {
        var line = remaining.substring(0, index);
        remaining = remaining.substring(index + 1);
        //console.log(line);
        line = line.split(' ')[1]
        // console.log(line);
        ipfs.push(line);
        index = remaining.indexOf('\n');
      }
    });

    input.on('end', function () {
      if (remaining.length > 0) {
        line = remaining.split(' ')[1]
        //ipfs.push(line); // Don't get last line, it is the directory
      }
      console.log("end file");

      return resolve(ipfs);
    }); // end on
  }); // end Promise
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
var ipfs = [];


function createSpaceShip(contract, shipID, name, type, ipfsaddress, price, account) {
    contract.spaceshipExist(shipID, {from: account}).then(function(SpaceshipExist) {
      if(SpaceshipExist){
        console.log("Spaceship " + shipID + " already exist.");
      }else{
        //contract.createPlanet(planetID, name, description, ipfsaddress, price, {from: account}).then(function() {
        contract.createSpaceShip(shipID, name, type, ipfsaddress, price, getRandomInt(10, 100), getRandomInt(100, 1000), { from: account }).then(function () { //condition, weapons, defence
        console.log("Spaceship " +shipID+ " created.");
        }).catch(
          function(err) {
            console.log("ERROR creating planet " + shipID + ": " + err.message);
        })
      } // fin if
    }).catch(function(err) {console.log("ERROR testing ship : " + shipID + ":" + err.message);
  }); // end deletePlanet
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
          var input = fs.createReadStream('./tools/spaceships-ipfs.txt');
          readLines(input).then(function (ipfs) {

              for (i = 0; i < 100; i ++) {
                // console.log(spaceshipsJSON[i].name);
                var type = spaceshipsJSON[i].type;
                var name = spaceshipsJSON[i].name;
                var price = getRandomInt(10, 100); // 10000000000 Mwei = 0.01 ETH
                if (i >= ipfs.length) {
                  ipfsaddress = ipfs[getRandomInt(0, ipfs.length-1)];
                } else {
                  ipfsaddress = ipfs[i];
                }
                var condition = spaceshipsJSON[i].condition;
                var weapons = spaceshipsJSON[i].weapons;
                var defence = spaceshipsJSON[i].defence;
                console.log("ipfsaddress =" + ipfsaddress);
                createSpaceShip(instance, i, name, type, ipfsaddress, price, accounts[0]);
                //  createSpaceShip(uint _tokenId, bytes32 _name, string _typeOfShip, string _ipfs, uint _price, uint _extractCapacity, uint _storageCapacity) public
                // instance.createSpaceShip(i, name, type, ipfsaddress, price, getRandomInt(10, 100), getRandomInt(100, 1000), { from: accounts[0] }).then(function () { //condition, weapons, defence
                //   console.log("Spaceship created.");
                // }).catch(
                //   function(err) {
                //     console.log("ERROR creating spaceship " + i + " : " + err.message);
                // })
              } // fin for
          }) // fin readLines
        }).catch(function(err) {
          console.log("ERROR getAccounts : " + err.message);
        }); // fin deployed
      }); // Fin getAccounts



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


console.log("Connecting to " + rpcAddress);
web3 = new Web3(new Web3.providers.HttpProvider(rpcAddress));
// Import our contract artifacts and turn them into usable abstractions.
import artifacts from './build/contracts/ERC721Planet.json';
var Planet = artifacts.require("ERC721Planet");
console.log(Planet);
*/
