pragma solidity ^0.4.18;

import "./SimpleERC721.sol";

  	/**
	 * @title ERC721SpaceShip
	 *
	 * A script that manages selling of spaceships in the Universe
	*/

contract ERC721SpaceShip is SimpleERC721 {

    // -----------------------------------------------------------------------------------------------------------
    // ------------------------------------------------ Variables ------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------

    string public name = "SpaceShip Token";
    string public symbol = "SST";

    struct SpaceShip {
      //uint id;
      bytes32 name;
      string description;
      bytes32 ipfs;
      address owner;
      // address discoveredBy;
      uint x;
      uint y;
      uint z;
      //bool discovered;
      bool forSale;
      uint price; // 0 => not for sale
      uint extractCapacity;
      uint storageCapacity;
      uint spaceshipPositionInList;
    }
    mapping (uint => SpaceShip) spaceships;
    uint[] private spaceshipsList; // WARNING: private is still readable ?

    // the one who deployed the smart contract
    address public owner;

    // The ether balance of all users of the smart contract
    mapping(address => uint) public BalanceOfEther;



    // -----------------------------------------------------------------------------------------------------------
    // ------------------------------------------------- Constructor ---------------------------------------------
    // -----------------------------------------------------------------------------------------------------------

    function ERC721SpaceShip() public {
        owner = msg.sender;
    }


    // -----------------------------------------------------------------------------------------------------------
    // -------------------------------------------------- Events -------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------

    event EmitUpForSale(uint256 _tokenId, uint256 _price);
    event EmitBought(uint256 _tokenId, uint256 _at, address _by);
    event EmitSaleOfferRemoved(uint256 _tokenId);


    // -----------------------------------------------------------------------------------------------------------
    // -------------------------------------------------- Modifiers ----------------------------------------------
    // -----------------------------------------------------------------------------------------------------------

    modifier onlyNonexistentToken(uint _tokenId) {
        require(spaceships[_tokenId].owner == address(0));
        _;
    }

    modifier isUpForSale(uint _tokenId) {
        require(spaceships[_tokenId].price > 0);
        _;
    }

    modifier isNotUpForSale(uint _tokenId) {
        require(spaceships[_tokenId].price == 0);
        _;
    }

    modifier onlyNotOwnerOfToken(uint _tokenId) {
        require(ownerOf(_tokenId) != msg.sender);
        _;
    }

    // -----------------------------------------------------------------------------------------------------------
    // ------------------------------------------------ View functions -------------------------------------------
    // -----------------------------------------------------------------------------------------------------------

    function getSpaceShipCount() public constant returns(uint count) {
      return spaceshipsList.length;
    }
    function getSpaceShip(uint _tokenId) public constant returns( bytes32 _name, string _description, bytes32 _ipfs, uint _price, uint _extractCapacity, uint _storageCapacity){
      return (spaceships[_tokenId].name, spaceships[_tokenId].description, spaceships[_tokenId].ipfs, spaceships[_tokenId].price, spaceships[_tokenId].extractCapacity, spaceships[_tokenId].storageCapacity);
    }

    // -----------------------------------------------------------------------------------------------------------
    // --------------------------------------------- Core Public functions ---------------------------------------
    // -----------------------------------------------------------------------------------------------------------

    /// @dev Initial acquisition of the token
/*    function initialBuySpaceShip (uint _tokenId) payable public onlyNonexistentToken (_tokenId) {
        require(msg.value == spaceships[_tokenId].price); // 0.1 eth = 100 finney
        require(_tokenId < 10000); // Limit to 10 000 spaceships

        BalanceOfEther[owner] += msg.value;

        _setTokenOwner(_tokenId, msg.sender);
        _addTokenToOwnersList(msg.sender, _tokenId);

        emit EmitBought(_tokenId, msg.value, msg.sender);
    }
*/
    /// @dev Create a SpaceShip
    function createSpaceShip(uint _tokenId, bytes32 _name, string _description, bytes32 _ipfs, uint _price, uint _extractCapacity, uint _storageCapacity) public
    {
        if(msg.sender != owner) revert();
        // TODO: Check if already exist ?

        spaceships[_tokenId].price = _price;
        spaceships[_tokenId].description = _description;
        spaceships[_tokenId].name = _name;
        spaceships[_tokenId].ipfs = _ipfs;
        spaceships[_tokenId].extractCapacity = _extractCapacity;
        spaceships[_tokenId].storageCapacity = _storageCapacity;
        //spaceships[_tokenId].owner =
        //spaceships[_tokenId].
        spaceships[_tokenId].spaceshipPositionInList = spaceshipsList.push(_tokenId) - 1;

    }
    /// @dev withdraw ether off the contract
    function withdraw() public
    {
        uint amount = BalanceOfEther[msg.sender];
        BalanceOfEther[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

    /// @dev putting token up for sale
    /// @notice the _price is in Wei
    function sellSpaceShip (uint _tokenId, uint _price) public onlyExtantToken (_tokenId) onlyOwnerOfToken (_tokenId) isNotUpForSale(_tokenId) {
        require(_price > 0);

        spaceships[_tokenId].price = _price;

        emit EmitUpForSale(_tokenId, _price);
    }

    /// @dev buying token from someone
    function buySpaceShip (uint _tokenId) payable public onlyExtantToken (_tokenId) isUpForSale (_tokenId) onlyNotOwnerOfToken (_tokenId) {
        require(msg.value == spaceships[_tokenId].price);

        spaceships[_tokenId].price = 0;
        BalanceOfEther[ownerOf(_tokenId)] += msg.value;

        _clearApprovalAndTransfer(ownerOf(_tokenId), msg.sender, _tokenId);

        emit EmitBought(_tokenId, msg.value, msg.sender);
    }

    /// @dev removing a sale proposition
    function removeSpaceShipFromSale (uint _tokenId) public onlyExtantToken (_tokenId) onlyOwnerOfToken (_tokenId) isUpForSale (_tokenId) {
        spaceships[_tokenId].price = 0;
        emit EmitSaleOfferRemoved(_tokenId);
    }

    // -----------------------------------------------------------------------------------------------------------
    // ----------------------------------------------- Internal functions ----------------------------------------
    // -----------------------------------------------------------------------------------------------------------

    // calls all the internal functions above, to transfer a token from one user to another
    // changed to nullify the selling offer when a token changes hands
    function _clearApprovalAndTransfer(address _from, address _to, uint _tokenId) internal
    {
        _clearTokenApproval(_tokenId);
        _removeTokenFromOwnersList(_from, _tokenId);

        spaceships[_tokenId].price = 0;

        _setTokenOwner(_tokenId, _to);
        _addTokenToOwnersList(_to, _tokenId);
    }
}
