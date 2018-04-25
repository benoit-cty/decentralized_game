var Planet = artifacts.require("ERC721Planet");

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


module.exports = function(callback) {
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
        var account = accounts[0];
        Planet.deployed().then(function(instance) {
          createPlanet(instance, 100, "Earth", "Plant blue.", "QmZgMVYuiz8es2QRozSSAxJD5vRuF1B31e7zvsBN4PGSv9", 1000, account);
        }).catch(function(err) {
          console.log("ERROR getAccounts : " + err.message);
        }); // end catch
      }); // end getAccounts
}
