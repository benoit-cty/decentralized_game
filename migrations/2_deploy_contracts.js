//const GustavoCoinCrowdsale = artifacts.require('./GustavoCoinCrowdsale.sol');
const PlanetToken = artifacts.require('./contracts/ERC721Planet.sol');

module.exports = function(deployer) {
  deployer.deploy(PlanetToken);
};
