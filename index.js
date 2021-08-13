//LIBRARIES: Load libraries and files
const Discord = require('discord.js'); //Necessary to connect to Discord API
const client = new Discord.Client(); //Creates a Client object, basically our bot
const Database = require("@replit/database") //Requires replit database package
const db = new Database() //Creates a Database object

//HANDLERS: Loading handlers collections (event handler, command handler)
client.commands = new Discord.Collection(); //This for command handler
client.events = new Discord.Collection(); //This for event handler

//HANDLERS: Loading handlers files (event handler, command handler)
['command-handler', 'event-handler'].forEach(handler =>{ 
  require(`./handlers/${handler}`)(client, Discord);
})

//MEMORY: Sends the memory usage on the console
const memory = `${Math.floor(process.memoryUsage().heapUsed / 1024 / 1000)} mb`
console.log(`[${new Date().toString().split(" ", 5).join(" ")}] Memory ${memory}`)

//CLIENT: Logins with our bots account
client.login(process.env.token); //Remember to put your token in the secret variable!