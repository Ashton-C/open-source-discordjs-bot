const fs = require('fs');

module.exports = (client, Discord) =>{
    const command_files = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));
var x = 0
    for(const file of command_files){
    const command = require(`../commands/${file}`);
    if(command.name){
      var x = x + 1
        client.commands.set(command.name, command);
    } else {
        continue;        
}
    }
}
//Taken from the YouTuber CodeLyon: https://www.youtube.com/channel/UC08G-UJT58SbkdmcOYyOQVw