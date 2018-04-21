var Planet = artifacts.require("ERC721Planet");

contract('ERC721Planet', function(accounts) {
  it("should be empty at startup", function() {
    return Planet.deployed().then(function(instance) {
      return instance.getPlanetCount.call();
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 0, "Wasn't empty");
    });
  });

  it("should create, then delete a planet", function() {
    return Planet.deployed().then(function(instance) {
      // createPlanet(uint _tokenId, bytes32 _name, string _description, bytes32 _ipfs, uint _price) public
      return instance.createPlanet(1, "PName", "PDesc", "ipfsaddress", "100", {from: accounts[0]}).then(
        function() {
         return instance.deletePlanet(1, {from: accounts[0]}).then(function() {
           return instance.getPlanetCount().then(function(count) {
               assert.equal(count, 0, "Not empty !");
             });
         });
    });
  })
  });


  it("should create, then buy a planet, then delete a planet", function() {
    return Planet.deployed().then(function(instance) {
      // createPlanet(uint _tokenId, bytes32 _name, string _description, bytes32 _ipfs, uint _price) public
      return instance.createPlanet(1, "PName", "PDesc", "ipfsaddress", 100, {from: accounts[0]}).then(function(res) {
        //console.log("createPlanet=" + res);
        return instance.buyPlanet(1, {from: accounts[1], to :instance.address, gas: 1000000, value:web3.toWei(100, "szabo")}
      ).then(function(res) {
            return instance.ownerOf(1).then(function(owner){
            //console.log("owner=" + owner);
            assert.equal(owner, accounts[1], "Wrong owner !");
            //assert.equal(-1, 1, "Not empty !");
             return instance.deletePlanet(1, {from: accounts[0]}).then(function() {
               return instance.getPlanetCount().then(function(count) {
                   assert.equal(count.valueOf(), 0, "Not empty !");
                 });
             });
          }); //ownerOf
        });//buy
    });
  })
}); // buy test


  it("create, buy, sell, then delete a planet", function() {
    return Planet.deployed().then(function(instance) {
      // createPlanet(uint _tokenId, bytes32 _name, string _description, bytes32 _ipfs, uint _price) public
      return instance.createPlanet(2, "PName", "PDesc", "ipfsaddress", 100, {from: accounts[0]}).then(function(res) {
        //console.log("createPlanet=" + res);
        return instance.buyPlanet(2, {from: accounts[2], to :instance.address, gas: 1000000, value:web3.toWei(100, "szabo")}
      ).then(function(res) {
            return instance.ownerOf(2).then(function(owner){
            //console.log("owner=" + owner);
            assert.equal(owner, accounts[2], "Wrong owner !");
            //assert.equal(-1, 1, "Not empty !");
            instance.sellPlanet(2, 500, {from: accounts[2], to :instance.address, gas: 1000000, value:web3.toWei(500, "szabo")}
          ).then(function() {
            instance.buyPlanet(2, {from: accounts[3], to :instance.address, gas: 1000000, value:web3.toWei(500, "szabo")}
          ).then(function(res) {
                return instance.ownerOf(2).then(function(owner){
                //console.log("owner=" + owner);
                assert.equal(owner, accounts[3], "Wrong owner !");
             return instance.deletePlanet(2, {from: accounts[0]}).then(function() {
               return instance.getPlanetCount().then(function(count) {
                   assert.equal(count.valueOf(), 0, "Not empty !");
                 });
             });
             });
             });
             });
          }); //ownerOf
        });//buy
    });
  })
}); // buy test

});
