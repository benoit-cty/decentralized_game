function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

App = {
  web3Provider: null,
  contracts: {},

  init: function() {


    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('ERC721Planet.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var Artifact = data;
      App.contracts.Planet = TruffleContract(Artifact);

      // Set the provider for our contract
      App.contracts.Planet.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.updatePlanet();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handleBuy);
  },

  listPlanets: function (planetInstance, planetNumber){
    //planets = [];
    console.log("getPlanets...");
    var count = planetNumber;
    console.log("getPlanets =" + count);
    var planetRow = $('#planetsRow');
    var planetTemplate = $('#planetTemplate');
    for (let planetID = 0; planetID < count; planetID++) {
      //var planetID = planetInstance.planetsList[i];
      //planets.push(planetID);
      console.log("planetInstance.getPlanet(planetID):");
      planetInstance.getPlanet(planetID).then(function(planet) {
        // getPlanet(uint _tokenId) public constant returns( bytes32 _name, string _description, string _ipfs, uint _price, address _owner){
        //console.log(planet);
        //console.log(planetID + " - " + web3.toAscii(planet[0]) + " - "  + planet[1] + " - "  + planet[3] + " - "  + planet[4]);
        var price = planet[3];
        planetTemplate.find('.panel-title').text(web3.toAscii(planet[0]));
        planetTemplate.find('.planet-desc').text(planet[1]);
        planetTemplate.find('.planet-owner').text(planet[4]);
        planetTemplate.find('.planet-uranium').text(getRandomInt(100, 1000));
        planetTemplate.find('.planet-gold').text(getRandomInt(100, 1000));
        planetTemplate.find('.planet-aluminium').text(getRandomInt(100, 1000));
        planetTemplate.find('.planet-copper').text(getRandomInt(100, 1000));
        planetTemplate.find('.planet-price').text(price * 1000 * 1000 * 1000);
        planetTemplate.find('.planet-location').text(getRandomInt(100, 1000));
        planetTemplate.find('img').attr('src', 'https://gateway.ipfs.io/ipfs/' + planet[2]);
        planetTemplate.find('.btn-buy').attr('data-price', price);
        planetTemplate.find('.btn-buy').attr('data-id', planetID);
        if(price = 0){
          // TODO: fix it
          planetTemplate.find('.btn-buy').attr('disabled', true);
        }
        planetRow.append(planetTemplate.html());
      }).catch(function(err) {
        console.log('ERROR - listPlanets : ' + err.message);
      });
    }
  },

  updatePlanet: function(planets, account) {
    var planetInstance;

    App.contracts.Planet.deployed().then(function(instance) {
      planetInstance = instance;

      return planetInstance.getPlanetCount();
    }).then(function(planets) {
      var msg = planets + " contract address : " + planetInstance.address;
      App.listPlanets(planetInstance, planets);
      console.log("msg="+msg);
      $('#planets-count').html(msg);
      /*for (i = 0; i < planets; i++) {
        if (planets[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-planet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }*/
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleBuy: function(event) {
    event.preventDefault();
    var planetId = parseInt($(event.target).data('id'));
    var price = parseInt($(event.target).data('price'));
    console.log("Ask to buy " + planetId + " for " + price);
    var planetInstance;
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Planet.deployed().then(function(instance) {
        planetInstance = instance;
        // Execute adopt as a transaction by sending account
        planetInstance.buyPlanet(planetId, {from: account, to : planetInstance.address, gas: 1000000, value:web3.toWei(price, "szabo")});
      }).then(function(result) {
        console.log("Buy done.");
          // result is an object with the following values:
          //
          // result.tx      => transaction hash, string
          // result.logs    => array of decoded events that were triggered within this transaction
          // result.receipt => transaction receipt object, which includes gas used

          // We can loop through result.logs to see if we triggered the Transfer event.
          /*var success = false
          for (var i = 0; i < result.logs.length; i++) {
            var log = result.logs[i];
            if (log.event == "EmitBought") {
              success =true;
              // TODO: Only update the specific planet
              return App.updatePlanet();
              // We found the event!
              break;
            }
          }*/


      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
