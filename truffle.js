module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*" // Match any network id
        },
  	    ropsten:  {
  	     network_id: 3,
         host: "localhost",
         port:  8545,
         gas: 4700036
        },
  	    ropstengcp:  {
  	     network_id: 3,
         host: "http://testrpc.courty.fr",
         port:  80,
         gas: 4700036
        }
    }
};
