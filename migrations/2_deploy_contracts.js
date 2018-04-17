//const GustavoCoinCrowdsale = artifacts.require('./GustavoCoinCrowdsale.sol');
const planetToken = artifacts.require('./contracts/ERC721Planet.sol');
const spaceshipToken = artifacts.require('./contracts/ERC721SpaceShip.sol');
module.exports = function(deployer) {
  deployer.deploy(planetToken);
  deployer.deploy(spaceshipToken);
};
