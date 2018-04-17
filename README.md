# decentralized_game
A game for mid-term exam of The School.ai

# Installation step
```
mkdir decentralized_game
cd decentralized_game/
truffle init
npm init -y
npm install -E zeppelin-solidity
```

## Update contract
In a terminal run:
```
ganache-cli --accounts 50
```
In another terminal
```
cd contracts
node ../test/deploy_planet_contract.js
node ../test/run_planet_tests.js
```

## Generating planets and spaceship
- We use scraping to get random planets and spaceships from http://www.scifiideas.com
- We use https://github.com/hardikvasa/google-images-download to get pictures of planets
- We then resized it with ImageMagick : resize_and_crop.py
- We upload them to IPFS using NodeJS
- Finally we feed these datas in the contracts with NodeJS

## Inspiration
- https://hackernoon.com/from-a-to-z-making-the-mvp-of-a-real-dapp-on-ethereum-and-deploying-it-50c750ef0c4e
