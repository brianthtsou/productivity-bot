const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const { testChannelId, customEmojiIdList } = require("../config.json");

module.exports = {
  name: "weeklyPollMessage",
  execute(client) {
    cron.schedule(
      "*/1 * * * *",
      async () => {
        console.log("Cron job triggered at", new Date());
        const channel = client.channels.cache.get(testChannelId);
        if (!channel) {
          console.log("Channel not found");
          return;
        }

        let today = new Date();

        // Array to hold today and the next six days
        let dates = [];
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        for (let i = 0; i < 7; i++) {
          // Create a new date object from today
          let newDate = new Date(today);
          // Add i days to the date
          newDate.setDate(today.getDate() + i);
          // Push the date in YYYY-MM-DD format to the array
          dates.push(newDate.toISOString().split("T")[0]);
        }

        try {
          const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Weekly Work Tracker")
            // Additional properties of the embed
            .setDescription(
              "React with the emoji corresponding with the days you've worked this week!"
            )
            .setTimestamp()
            .setFooter({ text: "Results will be added to the leaderboard!" });

          dates.forEach((date, index) => {
            const dayOfWeekEmoji = `<:${customEmojiIdList[index].name}:${customEmojiIdList[index].id}>`;
            exampleEmbed.addFields(
              {
                name: `${daysOfWeek[index]}  ${dayOfWeekEmoji}`,
                value: date,
                inline: false,
              }
              //   { name: "\u200B", value: "\u200B", inline: true }
            );
          });

          const sentMessage = await channel.send({
            content: "Hi!",
            embeds: [exampleEmbed],
          });

          for (const emoji of customEmojiIdList) {
            await sentMessage.react(emoji.id);
          }
        } catch (error) {
          console.error("Failed to send message:", error);
        }
      },
      {
        scheduled: true,
        timezone: "America/Los_Angeles",
      }
    );
  },
};