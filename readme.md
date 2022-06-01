# Cryptotester bot

Simple bot that watches NFT sales on a network of your choice. 

## 💻 Get the bot running 

First you need to change all the environment variables based on what you want. Check `env-example` for the list of variables and create a `.env` file with the ones you want to add.

### Without docker

If you have `node` and `npm` installed you can run

`npm i`

Once this is completed you should be able to start your bot with

`npm run start`

### With docker

This only requires you to have docker. (you also need to change your env variables here!)

`docker compose up`

Once this is completed you should see the bot running on port `3000`
