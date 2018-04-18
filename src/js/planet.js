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
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  updatePlanet: function(planets, account) {
    var planetInstance;

    App.contracts.Planet.deployed().then(function(instance) {
      planetInstance = instance;

      return planetInstance.planetsList.call();
    }).then(function(planets) {
      for (i = 0; i < planets.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleBuy: function(event) {
    event.preventDefault();
    var planetId = parseInt($(event.target).data('id'));
    var planetInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Planet.deployed().then(function(instance) {
        planetInstance = instance;

        // Execute adopt as a transaction by sending account
        return planetInstance.buyPlanet(petId, {from: account});
      }).then(function(result) {
        return App.updatePlanet();
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
