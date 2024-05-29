const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const { testChannelId, customEmojiIdList } = require("../config.json");
const weeklyPollMessage = require("../models/weeklyPollMessage");
const discordUser = require("../models/discordUser");
const dayCount = require("../models/dayCount");

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

        try {
          // create embed that holds poll message
          const leaderboardEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Leaderboard - Days Worked")
            // Additional properties of the embed
            .setDescription("See who is in the lead for most days worked!")
            .setTimestamp()
            .setFooter({ text: "Leaderboard updated weekly!" });

          const allUsers = await discordUser.find({});
          const userTotalCountDictArray = [];
          const userDayCount = await dayCount.findById(allUsers[0].day_counts);
          //   console.log(userDayCount);
          //   console.log(userDayCount["total_count"]);

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

          console.log(userTotalCountDictArray);
          //   dates.forEach((date, index) => {
          //     const dayOfWeekEmoji = `<:${customEmojiIdList[index].name}:${customEmojiIdList[index].id}>`;
          //     exampleEmbed.addFields(
          //       {
          //         name: `${daysOfWeek[index]}  ${dayOfWeekEmoji}`,
          //         value: date,
          //         inline: false,
          //       }
          //       //   { name: "\u200B", value: "\u200B", inline: true }
          //     );
          //   });

          //   // send poll message
          //   const sentMessage = await channel.send({
          //     content: "Hi!",
          //     embeds: [exampleEmbed],
          //   });

          //   // react with days of week emojis
          //   for (const emoji of customEmojiIdList) {
          //     await sentMessage.react(emoji.id);
          //   }

          //   const doc = {
          //     message_id: sentMessage.id,
          //     created_at: new Date(sentMessage.createdTimestamp),
          //   };

          //   const msg = new weeklyPollMessage(doc);
          //   // msg
          //   //   .save()
          //   .then((doc) => {
          //     console.log("Document saved:", doc);
          //   })
          //   .catch((err) => {
          //     console.error("Error saving document:", error);
          //   });
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
