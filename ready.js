//CLIENT: Waiting client's ready event
module.exports = async (Discord, client) => {
  console.log(`[${new Date().toString().split(" ", 5).join(" ")}] The bot its ready and online!`)

//Client: Changing the status of the bot
client.user.setActivity("your code!", { type: 'LISTENING' }); //Here you can put your status! You can replace LISTENING with: WATCHING, PLAYING and CONTESTING.
}