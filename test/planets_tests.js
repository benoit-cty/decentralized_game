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
           return instance.getPlanetCount.call();
         });
    });
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 0, "Wasn't empty");
    });
  });
});
