pragma solidity ^0.4.18;

import "./SimpleERC721.sol";

  	/**
	 * @title ERC721Planet
	 *
	 * A script that manages selling of planets in the Universe
	*/

contract ERC721Planet is SimpleERC721 {

    // -----------------------------------------------------------------------------------------------------------
    // ------------------------------------------------ Variables ------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------

    string public name = "Planet Token";
    string public symbol = "PLNT";

    struct Planet {
      //uint id;
      bytes32 name;
      string description;
      string ipfs;
      address owner;
      address discoveredBy;
      uint x;
      uint y;
      uint z;
      bool discovered;
      //bool forSale;
      uint price; // 0 => not for sale
      uint planetPositionInList;
    }
    mapping (uint => Planet) planets;
    uint[] public planetsList; // WARNING: private is still readable ?

    // the one who deployed the smart contract
    address public owner;

    // The ether balance of all users of the smart contract
    mapping(address => uint) public BalanceOfEther;



    // -----------------------------------------------------------------------------------------------------------
    // ------------------------------------------------- Constructor ---------------------------------------------
    // -----------------------------------------------------------------------------------------------------------

    constructor() public {
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
        require(planets[_tokenId].owner == address(0));
        _;
    }

    modifier isUpForSale(uint _tokenId) {
        require(planets[_tokenId].price > 0);
        _;
    }

    modifier isNotUpForSale(uint _tokenId) {
        require(planets[_tokenId].price == 0);
        _;
    }

    modifier onlyNotOwnerOfToken(uint _tokenId) {
        require(ownerOf(_tokenId) != msg.sender);
        _;
    }

    // -----------------------------------------------------------------------------------------------------------
    // ------------------------------------------------ View functions -------------------------------------------
    // -----------------------------------------------------------------------------------------------------------

    function getPlanetCount() public constant returns(uint count) {
      return planetsList.length;
    }


    function getPlanet(uint _tokenId) public constant returns( bytes32 _name, string _description, string _ipfs, uint _price, address _owner){
      if(planetExist(_tokenId)){
        return (planets[_tokenId].name, planets[_tokenId].description, planets[_tokenId].ipfs, planets[_tokenId].price, ownerOf(_tokenId));
      }else{
        return ("dont_exist", "dont_exist", "dont_exist", 0, 0);
      }
    }

    function planetExist(uint _tokenId) public constant returns(bool isIndeed) {
      if(planetsList.length == 0) return false;
      if(planetsList[planets[_tokenId].planetPositionInList] == _tokenId){
        return true;
      }else{
        return false;
      }
    }
    // -----------------------------------------------------------------------------------------------------------
    // --------------------------------------------- Core Public functions ---------------------------------------
    // -----------------------------------------------------------------------------------------------------------

    /// @dev Create a Planet
    function createPlanet(uint _tokenId, bytes32 _name, string _description, string _ipfs, uint _price) public
    {
        if(msg.sender != owner) revert();
        if(planetExist(_tokenId)) revert();
        // Set the ownership to creator
        _setTokenOwner(_tokenId, msg.sender);
        _addTokenToOwnersList(msg.sender, _tokenId);
        planets[_tokenId].price = _price;
        planets[_tokenId].description = _description;
        planets[_tokenId].name = _name;
        planets[_tokenId].ipfs = _ipfs;
        //planets[_tokenId].owner =
        //planets[_tokenId].
        planets[_tokenId].planetPositionInList = planetsList.push(_tokenId) - 1;

    }

    /// @dev Update a Planet
    function updatePlanet(uint _tokenId, bytes32 _name, string _description, string _ipfs, uint _price) public
    {
        if(!planetExist(_tokenId)) revert();
        //TODO: Check who can update it other than owner of the contract ?
        if(msg.sender != owner) revert();
        planets[_tokenId].price = _price;
        planets[_tokenId].description = _description;
        planets[_tokenId].name = _name;
        planets[_tokenId].ipfs = _ipfs;
    }
    /// @dev Delete a Planet
    function deletePlanet(uint _tokenId) public
    {
        if(msg.sender != owner) revert(); // fix it
        if(planetExist(_tokenId)){
          uint rowToDelete = planets[_tokenId].planetPositionInList;
          uint keyToMove   = planetsList[planetsList.length - 1];
          planetsList[rowToDelete] = keyToMove;
          planets[keyToMove].planetPositionInList = rowToDelete;
          planetsList.length--;
          //planets[_tokenId].planetPositionInList = planetsList.push(_tokenId) - 1;
          delete planets[_tokenId];
        }
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
    function sellPlanet (uint _tokenId, uint _price) public onlyExtantToken (_tokenId) onlyOwnerOfToken (_tokenId) isNotUpForSale(_tokenId) {
        require(_price > 0);

        planets[_tokenId].price = _price;

        emit EmitUpForSale(_tokenId, _price);
    }

    /// @dev buying token from someone
    function buyPlanet (uint _tokenId) payable public onlyExtantToken (_tokenId) isUpForSale (_tokenId) onlyNotOwnerOfToken (_tokenId) {
         if(msg.value > planets[_tokenId].price) // fix it szabo to Wei : * 1000000000000
         {
                   planets[_tokenId].price = 0;
                   BalanceOfEther[ownerOf(_tokenId)] += msg.value;
                   _clearApprovalAndTransfer(ownerOf(_tokenId), msg.sender, _tokenId);
                   emit EmitBought(_tokenId, msg.value, msg.sender);
         }else{
           revert();
         }

    }

    /// @dev removing a sale proposition
    function removePlanetFromSale (uint _tokenId) public onlyExtantToken (_tokenId) onlyOwnerOfToken (_tokenId) isUpForSale (_tokenId) {
        planets[_tokenId].price = 0;
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

        planets[_tokenId].price = 0;

        _setTokenOwner(_tokenId, _to);
        _addTokenToOwnersList(_to, _tokenId);
    }
}
