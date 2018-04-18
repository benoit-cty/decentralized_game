# decentralized_game
A game for mid-term exam of The School.ai

![Architecture](./doc/architecture.jpg)


# Creation step
```
mkdir decentralized_game
cd decentralized_game/
truffle init
npm init -y
npm install -E zeppelin-solidity
```

## Test contract
run ganache-cli
```
truffle compile
truffle migrate
truffle test
```

## Generating planets and spaceship
- We use scraping to get random planets and spaceships from http://www.scifiideas.com
- We use https://github.com/hardikvasa/google-images-download to get pictures of planets
- We then resized it with ImageMagick : resize_and_crop.py
- We upload them to IPFS using NodeJS
- Finally we feed these datas in the contracts with NodeJS

## Inspiration
- https://hackernoon.com/from-a-to-z-making-the-mvp-of-a-real-dapp-on-ethereum-and-deploying-it-50c750ef0c4e
