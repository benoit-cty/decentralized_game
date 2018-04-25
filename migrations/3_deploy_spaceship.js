const spaceshipToken = artifacts.require('./contracts/ERC721SpaceShip.sol');
module.exports = function(deployer) {
  deployer.deploy(spaceshipToken);
};
