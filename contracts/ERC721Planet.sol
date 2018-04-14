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

    mapping(uint => string) public tokenToPixelsColors;
    mapping(uint => string) public tokenToDescription;
    mapping(uint => string) public tokenToLink;

    // the one who deployed the smart contract
    address public owner;

    // The ether balance of all users of the smart contract
    mapping(address => uint) public BalanceOfEther;

    mapping(uint => uint) public tokenToSalePrice; // if equals zero, it's not up for sale

    // -----------------------------------------------------------------------------------------------------------
    // ------------------------------------------------- Constructor ---------------------------------------------
    // -----------------------------------------------------------------------------------------------------------

    function ERC721Planet() public {
        owner = msg.sender;
    }

    // -----------------------------------------------------------------------------------------------------------
    // -------------------------------------------------- Events -------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------

    event EmitUpForSale(uint256 _tokenId, uint256 _price);
    event EmitBought(uint256 _tokenId, uint256 _at, address _by);
    event EmitSaleOfferRemoved(uint256 _tokenId);

    event EmitChangedPixelsColors(uint256 _tokenId);
    event EmitChangedDescription(uint256 _tokenId);
    event EmitChangedLink(uint256 _tokenId);


    // -----------------------------------------------------------------------------------------------------------
    // -------------------------------------------------- Modifiers ----------------------------------------------
    // -----------------------------------------------------------------------------------------------------------

    modifier onlyNonexistentToken(uint _tokenId) {
        require(tokenIdToOwner[_tokenId] == address(0));
        _;
    }

    modifier isUpForSale(uint _tokenId) {
        require(tokenToSalePrice[_tokenId] > 0);
        _;
    }

    modifier isNotUpForSale(uint _tokenId) {
        require(tokenToSalePrice[_tokenId] == 0);
        _;
    }

    modifier onlyNotOwnerOfToken(uint _tokenId) {
        require(ownerOf(_tokenId) != msg.sender);
        _;
    }

    // -----------------------------------------------------------------------------------------------------------
    // ------------------------------------------------ View functions -------------------------------------------
    // -----------------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------------
    // --------------------------------------------- Core Public functions ---------------------------------------
    // -----------------------------------------------------------------------------------------------------------

    /// @dev Initial acquisition of the token
    function initialBuyToken (uint _tokenId) payable public onlyNonexistentToken (_tokenId) {
        require(msg.value == 100 finney); // 0.1 eth = 100 finney
        require(_tokenId < 10000);

        BalanceOfEther[owner] += msg.value;

        _setTokenOwner(_tokenId, msg.sender);
        _addTokenToOwnersList(msg.sender, _tokenId);

        totalSupply += 1;

        emit EmitBought(_tokenId, msg.value, msg.sender);
    }

    /// @dev changing the colors of the token
    function setTokenPixelsColors (uint _tokenId, string _newColors) public onlyExtantToken (_tokenId) onlyOwnerOfToken (_tokenId) {
        tokenToPixelsColors[_tokenId] = _newColors;
        emit EmitChangedPixelsColors(_tokenId);
    }

    /// @dev changing the description of the token
    function setTokenDescription (uint _tokenId, string _newDescription) public onlyExtantToken (_tokenId) onlyOwnerOfToken (_tokenId) {
        tokenToDescription[_tokenId] = _newDescription;
        emit EmitChangedDescription(_tokenId);
    }

    /// @dev changing the link of the token
    function setTokenLink (uint _tokenId, string _newLink) public onlyExtantToken (_tokenId) onlyOwnerOfToken (_tokenId) {
        tokenToLink[_tokenId] = _newLink;
        emit EmitChangedLink(_tokenId);
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
    function sellToken (uint _tokenId, uint _price) public onlyExtantToken (_tokenId) onlyOwnerOfToken (_tokenId) isNotUpForSale(_tokenId) {
        require(_price > 0);

        tokenToSalePrice[_tokenId] = _price;

        emit EmitUpForSale(_tokenId, _price);
    }

    /// @dev buying token from someone
    function buyToken (uint _tokenId) payable public onlyExtantToken (_tokenId) isUpForSale (_tokenId) onlyNotOwnerOfToken (_tokenId) {
        require(msg.value >= tokenToSalePrice[_tokenId]);

        tokenToSalePrice[_tokenId] = 0;
        BalanceOfEther[ownerOf(_tokenId)] += msg.value;

        _clearApprovalAndTransfer(ownerOf(_tokenId), msg.sender, _tokenId);

        emit EmitBought(_tokenId, msg.value, msg.sender);
    }

    /// @dev removing a sale proposition
    function removeTokenFromSale (uint _tokenId) public onlyExtantToken (_tokenId) onlyOwnerOfToken (_tokenId) isUpForSale (_tokenId) {
        tokenToSalePrice[_tokenId] = 0;
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

        tokenToSalePrice[_tokenId] = 0;

        _setTokenOwner(_tokenId, _to);
        _addTokenToOwnersList(_to, _tokenId);
    }
}
