module.exports = {
  name: "ping", //This will be the command itself
  description:"Checks the bot current ping", //The description doesnt get used anywhere
  permitions: "SEND_MESSAGES", //Here you can put the required permission (only one)
  cooldown: 2, //Here you can put the cooldown in seconds
  async execute(client, message, args, Discord) {
    const ping = Date.now() - message.createdTimestamp
    const latency = Math.round(client.ws.ping)
    message.channel.send(`🏓 Pong! \nThe bot ping it's \`${ping}ms\`. \nThe Discord API latency is \`${latency}ms\``);
  }
}