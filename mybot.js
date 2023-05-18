require('dotenv').config();

const { MessageEmbed } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Intents } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,] });

client.commands = new Collection();

function sendText(channelName, text){
  
    client.guilds.cache.forEach((guild) => {
        guild.channels.cache.forEach((channel) =>{
            if (channel.name == channelName){
                let generalChannel = client.channels.cache.get(channel.id);
                if (text != "")
                    generalChannel.send(text);
            }
        })
    });
}

function sendAttachment(channelName, attach){
    client.guilds.cache.forEach((guild) => {
        guild.channels.cache.forEach((channel) =>{
            if (channel.name == channelName){
                let generalChannel = client.channels.cache.get(channel.id);
                if (attach != "")
                    generalChannel.send({files: attach});
            }
        })
    });
}

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
    console.log("Abbababab")
}

client.on(Events.ClientReady, () => {
    console.log("Connected as " + client.user.tag);

    client.user.setActivity("your every move", {type : "WATCHING"});
    sendText("general","I'm online!");
    sendText("general", "http://www.reactiongifs.com/wp-content/uploads/2012/05/hello.gif")
   
});

client.on(Events.InteractionCreate, async interaction => {

	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


/*
client.on("messageCreate", (msg) => {
    let bday = "Happy Birthday Shemoya, you're here now!";
    msg.content = msg.content.toLowerCase();
    if (msg.author === client.user)
        return;
    
    if (msg.content === 'testing')
        msg.channel.send(`${msg.author.toString()} Hey, I'm working`)
    if (msg.content.indexOf("/") == 0)
        executeCommands(msg);
    if (msg.content.includes("good bot"))
        sendText(msg.channel.name, ":smile:");
    if (msg.content.includes("bad bot"))
        sendText(msg.channel.name, ":sob:")
    if (msg.content.includes("say welcome to superstar"))
        sendText(msg.channel.name, bday);
    
        
    
        
   
});
*/


const TOKEN = process.env.TOKEN;
client.login(TOKEN);


function executeCommands(message){
    let text = message.content.substr(1);
    let words = text.split(" ");

    //whatis command
    if (words[0] == "whatis"){
        let searchTerm = "";
        let keywords = words.slice(1, words.length);
        keywords.forEach((keyword) => {
            keyword = keyword[0].toUpperCase() + keyword.substr(1);
            searchTerm += keyword + "_";
        });
        
        message.channel.send(`${message.author.toString()}`)  
        sendText(message.channel.name,`https://en.wikipedia.org/wiki/${searchTerm.substr(0,searchTerm.length - 1)}`);   
        }
    else if (words[0] == "rr"){
        const videoEmbed = new MessageEmbed().setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ").setTimestamp("00:00:02");
        sendText(message.channel.name, "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1s");  
    }
    
}

       