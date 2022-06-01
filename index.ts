import { Message, MessageAttachment, MessageEmbed, Intents } from "discord.js";
import { ethers } from "ethers";
import erc721 from "./erc71";
import Twit from 'twit';
import fetch from "node-fetch";
import 'dotenv/config'

const { Client } = require('discord.js');


const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// var T = new Twit({
//   consumer_key:         process.env.TWITTER_CONSUMER_KEY,
//   consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
//   access_token:         process.env.TWITTER_ACCESS_TOKEN,
//   access_token_secret:  process.env.TWITTER_TOKEN_SECRET,
// })

client.once('ready', () => {
	console.log('Ready!');
});

const provider = new ethers.providers.InfuraProvider(process.env.NETWORK)
console.log(process.env.CONTRACT_ADDRESS)
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, erc721, provider)

contract.on("Transfer", async (_to, _from, _amount, token) => {
	try {
		const tx = await provider.getTransaction(token.transactionHash)
		if (tx && tx.value && tx.value._hex) {
			const price = ethers.utils.formatEther(tx.value._hex)
			if (token.args.tokenId._hex) {
				const tokenId = parseInt(token.args.tokenId._hex)
				const tokenURI = await contract.tokenURI(tokenId)				
				const res = await fetch(tokenURI)
				const ipfsData = await res.json()

				const image = ipfsData.image

				const imageEnding =  image.split('/')[image.split('/').length - 1]
				const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL);

				const attachment = new MessageAttachment(image);
				const embed = new MessageEmbed()
					.setDescription(`[${tokenId}](${process.env.PLATFORM_URL}/${process.env.CONTRACT_ADDRESS}/${tokenId}) sold for ${price}ETH`)
					.setImage(`attachment://${imageEnding}`);
				channel.send({files: [attachment], embeds: [embed]})
			}
		}
		// T.post('statuses/update', { status: 'hello world!' }, (err, data, response) => {
		// 	console.log(data)
		// })
	}
	catch (e) {
		console.log(e)
	}
});


client.login(token);