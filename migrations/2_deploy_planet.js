const planetToken = artifacts.require('./contracts/ERC721Planet.sol');
module.exports = function(deployer) {
  deployer.deploy(planetToken);
};
