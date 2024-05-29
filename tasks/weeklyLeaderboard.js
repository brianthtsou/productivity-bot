const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const { testChannelId, customEmojiIdList } = require("../config.json");
const discordUser = require("../models/discordUser");
const dayCount = require("../models/dayCount");

module.exports = {
  name: "overallLeaderboard",
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

        try {
          // create embed that holds leaderboard message
          const leaderboardEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Leaderboard - Overall Days Worked")
            // Additional properties of the embed
            .setDescription(
              "See who is in the lead for most days worked overall!"
            )
            .setTimestamp()
            .setFooter({ text: "Leaderboard updated weekly!" });

          const allUsers = await discordUser.find({});
          const userTotalCountDictArray = [];
          const userDayCount = await dayCount.findById(allUsers[0].day_counts);

          // sort all users in descending order of total_count
          for (let index = 0; index < allUsers.length; index++) {
            let user = allUsers[index];
            let userDayCount = await dayCount.findById(user.day_counts);
            let dict = {
              username: user.username,
              total_count: userDayCount["total_count"],
            };
            userTotalCountDictArray.push(dict);
          }

          let testDict = {
            username: "test",
            total_count: 500,
          };
          userTotalCountDictArray.push(testDict);
          console.log(userTotalCountDictArray);

          userTotalCountDictArray.sort((obj1, obj2) => {
            return obj2.total_count - obj1.total_count; // Reverse the order for descending
          });

          // add names and values to leaderboard
          const medalEmojiList = [
            `:first_place:`,
            `:second_place:`,
            `:third_place:`,
          ];
          userTotalCountDictArray.forEach((user, index) => {
            let embedNameString;
            if (index >= 0 && index < 3) {
              embedNameString = `${medalEmojiList[index]} - ${user.username}`;
            } else {
              embedNameString = `${index + 1}.  ${user.username}`;
            }
            leaderboardEmbed.addFields(
              {
                name: embedNameString,
                value: `${user.total_count}`,
                inline: false,
              }
              //   { name: "\u200B", value: "\u200B", inline: true }
            );
          });

          // send leaderboard message
          const sentMessage = await channel.send({
            content: "Leaderboard",
            embeds: [leaderboardEmbed],
          });
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
