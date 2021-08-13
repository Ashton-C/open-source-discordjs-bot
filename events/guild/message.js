//COOLDOWNS: Creates the map to work with cooldowns
const cooldowns = new Map();

//LIBRARIES: Loads fs to read files
const fs = require('fs');

//MODULES: Import the message module
module.exports = async (Discord, client, message) => {

//LIBRARIES: Loads the prefix from the secret variable
const prefix = process.env.prefix

//MESSAGE: If the author of the message it's a bot, return
if(message.author.bot) return

//MESSAGE: If the message was sent in a Direct Message, return
if(message.channel.type === 'dm') {
  if(message.content.startsWith(process.env.prefix)) return message.channel.send(`:x: Error! You can't use the bot in Direct Messages, create a server instead! :x:`)
  return
}

//MESSAGE: If the message doesnt start with the prefix, return
if (!message.content.startsWith(prefix)) return

//FILES: Sets all the informations needed to read the commands
let files = fs.readdirSync(`./commands/`)
const comFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

//LIBRARIES: Loads stringSimilarity, needed for sorting commands and giving the suggestion
var stringSimilarity = require("string-similarity");

//CONSTRUCTORS: Sets a couple of constructors needed for the code
const args = message.content.slice(prefix.length).split(/ +/);
const cmd = args.shift().toLowerCase();
const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
    
//SUGGESTION COMMANDS: Gets the best match, the most similar command to the wrong one
var possibilitiesCom = stringSimilarity.findBestMatch(cmd, comFiles);
var stringifyCom = JSON.stringify(possibilitiesCom); 
var resultCom = stringifyCom.split(',"bestMatch":{"target":"').pop().split('","rating":');
var stringifyComAgain = JSON.stringify(resultCom); 
var splitPointCom = stringifyComAgain.split("\"")
var possibilityCom = splitPointCom[1]
var dotCom = possibilityCom.split(".")
var suggestionCom = JSON.stringify(dotCom[0]); //This is the result (the most similar command file)

//COOLDOWN: If finds a command, checks cooldown
if(command){   
if(!cooldowns.has(command.name)){
    cooldowns.set(command.name, new Discord.Collection());
}
const current_time = Date.now(); //Current time
const time_stamps = cooldowns.get(command.name);
const cooldown_amount = (command.cooldown) * 1000; //In seconds!
if(time_stamps.has(message.author.id)){ //If finds a cooldown associated with the authors ID
    const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;
    if(current_time < expiration_time){
        const time_left = (expiration_time - current_time) / 1000;
        const cooldownwait = new Discord.MessageEmbed() //You can change this embed to whatever you want
        .setTitle("You are on cooldown")
        .setDescription(`You still need to wait ${Math.round(time_left.toFixed(1))} seconds before using this command again`);

        return message.reply(cooldownwait); //Sends the embed
    }
} 

//PERMISSIONS: Error embed in case of the command fails
const commandFailed = new Discord.MessageEmbed()
    .setTitle("Something unexpected occured")
    .setDescription("Try again later");

//COOLDOWN: Sets the current cooldown time or deletes it
time_stamps.set(message.author.id, current_time);
setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);

//PERMISSIONS: Checks if the permission of the command its OWNER (only the owner can use the command)
if(command) {
const perms = command.permitions
const botPerms = command.botPerms
if(perms === "OWNER") {
  if(message.author.id != process.env.ownerID && message.author.id != process.env.coOwnerID) { //Insert in one of these your ID and another co-owner ID (in secret variables, if you dont have a co-owner put again your id)
    const warn1 = new Discord.MessageEmbed()
      .setTitle("Missing perms")
      .setDescription(`Required permission to use this command: \`${perms}\``);

   return message.channel.send(warn1)
  } else { //If the author its the owner, execute the command
  try {
   return command.execute(client, message, args, Discord, prefix); //Run the command
  } catch (error) { //In case the command fails, sends this error embed
  message.channel.send(commandFailed) //Sends the error message
    }
  }
  } else if (message.member.permissions.has(perms)) { //If the author has the correct perks, execute the command
    try {
    return command.execute(client, message, args, Discord, prefix); //Run the command
    } catch (error) { //In case the command fails, sends this error embed
  message.channel.send(commandFailed) //Sends the error message
    }
  } else { //If the author hasnt the correct perks, sends an error message
   return message.channel.send(warn1) //You can change it at line 87
  }
     } 
    } else { 
            return message.channel.send(`Invalid command. Did you mean \`${suggestionCom}\`?`)
     }
}
