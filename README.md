# productivity-bot

## Description

Productivity-Bot is a Discord bot built with Node.js and Discord.js. It helps track and manage work days through interactive polls in Discord channels. Users can react to these polls with specific emojis corresponding to the days they worked from Sunday to Saturday. The bot stores these reactions in MongoDB and posts a weekly leaderboard to encourage friendly competition among users.

## Features

- **Weekly Polls:** Automatically sends a message every week to a designated channel, asking users to mark the days they worked.
- **Emoji Reactions:** Users can react to the poll message with day-specific emojis to record their working days.
- **Data Storage:** All reactions are stored in MongoDB, ensuring data persistence and ease of access.
- **Leaderboard:** Posts a weekly leaderboard in the channel, showing the most active users to foster competition.

## Installation

### Prerequisites

- Node.js
- MongoDB
- A Discord account and a bot token

### Setup

1. **Clone the Repository**
   git clone https://github.com/yourusername/weekly-tracker-discord-bot.git
   cd weekly-tracker-discord-bot

   ```

   ```

2. **Install Dependencies**
   npm install

3. **Configure Your Bot**
   Create a `config.json` file in the root directory (or set environment variables for sensitive data):

   ```json
   {
     "token": "YOUR_DISCORD_BOT_TOKEN",
     "clientId": "YOUR_CLIENT_ID",
     "guildId": "YOUR_GUILD_ID",
     "MONGODB_URI": "YOUR_MONGODB_URI",
     "pollChannelId": "DISCORD_CHANNEL_ID",
     "customEmojiIdList": [
       { "name": "sunday", "id": "SUNDAY_EMOJI_ID" },
       { "name": "monday", "id": "MONDAY_EMOJI_ID etc...." }
     ]
   }
   ```

4. **Start the Bot**
   node index.js

## Usage

- The bot will automatically post a poll in the specified channel each week.
- Users should react with the corresponding emojis for each day they worked:
  - Custom emojis are used by adding them to your server and including their emojiId's in the config.json
- The leaderboard will be updated and posted at the end of each week based on the reactions collected.
