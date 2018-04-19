var Spaceship = artifacts.require("ERC721SpaceShip");

contract('ERC721SpaceShip', function(accounts) {
  it("should buy a planet", function() {
    return Spaceship.deployed().then(function(instance) {
      return instance.getSpaceShipCount.call();
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 0, "Wasn't empty");
    });
  });

  it("should create a Spaceship", function() {
    return Spaceship.deployed().then(function(instance) {
      // createSpaceShip(uint _tokenId, bytes32 _name, string _description, bytes32 _ipfs, uint _price, uint _extractCapacity, uint _storageCapacity) public
      return instance.createSpaceShip(1, "SSName", "SSType", "ipfsaddress", "100", "50", "20", {from: accounts[0]}).then(
        function() {
        return instance.getSpaceShipCount.call();
    })
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 1, "Wasn't empty");
    });
  });
});
