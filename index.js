// Require the necessary discord.js classes
const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { token, testChannelId, MONGODB_URI } = require("./config.json");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    // GatewayIntentBits.MessageContent,
  ],
  allowedMentions: {
    parse: ["users", "roles", "everyone"],
    repliedUser: true,
  },
});

mongoose.set("strictQuery", false);

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((error) => {
    console.error("error connecitng to mongoDB:", error.message);
  });

// sets commands from commands folder
client.commands = new Collection();
client.tasks = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// sets events from events folder
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// sets tasks from tasks folder
const tasksPath = path.join(__dirname, "tasks");
const taskFiles = fs
  .readdirSync(tasksPath)
  .filter((file) => file.endsWith(".js"));

for (const file of taskFiles) {
  const task = require(`./tasks/${file}`);
  client.tasks.set(task.name, task);
  task.execute(client);
  console.log(task.name);
}

// Log in to Discord with your client's token
client.login(token);
