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
            assert.equal(owner, accounts[1], "Not empty !");
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



});
