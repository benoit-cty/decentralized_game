var Planet = artifacts.require("ERC721Planet");
//var Promise = require("promise");
var fs = require('fs');
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


function readLines(input) {
  return new Promise(function(resolve, reject) {
    var remaining = '';

    input.on('data', function(data) {
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

    input.on('end', function() {
      if (remaining.length > 0) {
        line = remaining.split(' ')[1]
        //ipfs.push(line); // Don't get last line, it is the directory
      }
      console.log("end file");

      return resolve(ipfs);
    }); // end on
  }); // end Promise
}

function createPlanet(contract, planetID, name, description, ipfsaddress, price, account) {
    contract.planetExist(planetID, {from: account}).then(function(planetExist) {
      if(planetExist){
        console.log("Planet " + planetID + " already exist.");
      }else{
        contract.createPlanet(planetID, name, description, ipfsaddress, price, {from: account}).then(function() {
        console.log("Planet " +planetID+ " created.");
        }).catch(
          function(err) {
            console.log("ERROR creating planet " + planetID + ": " + err.message);
        })
      } // fin if
    }).catch(function(err) {console.log("ERROR testing planet : " + planetID + ":" + err.message);
  }); // end deletePlanet
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
var ipfs = [];

module.exports = function(callback) {


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
          contract=instance;
          // Load planets json
          var planetsJSON = require('./planets0-100.json');
          //console.log(planetsJSON);
          //console.log(planetsJSON.length);
          var input = fs.createReadStream('./tools/planets-ipfs.txt');
          readLines(input).then(function(ipfs) {
              //console.log("ipfs.length=" + ipfs.length);
              for (var i = 0; i < planetsJSON.length; i ++) { // planetsJSON.length
                //console.log(planetsJSON[i].name);
                var description = planetsJSON[i].description;
                var name = planetsJSON[i].name;
                var price = getRandomInt(100, 1000); // 10000000000 Mwei = 0.01 ETH // https://etherconverter.online/
                //console.log("ipfs.length=" + ipfs.length);
                if(i >= ipfs.length){
                  ipfsaddress = ipfs[getRandomInt(0, ipfs.length-1)];
                }else{
                  ipfsaddress = ipfs[i];
                }
                console.log("planet : " + name);
                planetExist = false;
                //instance.deletePlanet(i, {from: accounts[0]}).then(function() {
                createPlanet(instance, i, name, description, ipfsaddress, price, account);
              }; // end for loop
          }) // end readLines
        }).then(function() {
          return contract.getPlanetCount();
        }).then(function(count) {
          console.log("Planet number = " + count );
        }).catch(function(err) {
          console.log("ERROR getAccounts : " + err.message);
        }); // end catch
      }); // end getAccounts



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
