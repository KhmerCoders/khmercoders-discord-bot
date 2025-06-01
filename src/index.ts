import { Client, GatewayIntentBits, Events } from "discord.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create a new client instance with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Required for accessing message content
  ],
});

// When the client is ready, run this code once
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log message events
client.on(Events.MessageCreate, (message) => {
  // Ignore messages from bots (including our own)
  if (message.author.bot) return;

  // Log the message details
  console.log(`User ID: ${message.author.id}`);
  console.log(`Display Name: ${message.author.displayName}`);
  console.log(`Message: ${message.content}`);
  console.log("-----------------------------------");

  // Check if webhook URL is configured
  if (process.env.DISCORD_WEBHOOK) {
    // Create a message payload
    const payload = {
      user_id: message.author.id,
      username: message.author.displayName,
      content: message.content,
      avatar_url: message.author.displayAvatarURL(),
      embeds: message.embeds.length > 0 ? message.embeds : undefined,
    };

    // Send the message to the webhook
    fetch(process.env.DISCORD_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          console.error(
            "Failed to forward message to webhook:",
            response.status
          );
        }
      })
      .catch((error) => {
        console.error("Error forwarding message to webhook:", error);
      });
  }
});

// Login to Discord with the token from .env file
client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error("Failed to login to Discord:", error);
});
