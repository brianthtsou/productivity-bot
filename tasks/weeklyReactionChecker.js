const cron = require("node-cron");
const { testChannelId, customEmojiIdList } = require("../config.json");
const weeklyPollMessage = require("../models/weeklyPollMessage");
const discordUser = require("../models/discordUser");
const dayCount = require("../models/dayCount");

module.exports = {
  name: "weeklyReactionChecker",
  execute(client) {
    cron.schedule("* * * * *", async () => {
      const lastPoll = await weeklyPollMessage.findOne();

      if (!lastPoll) {
        console.log("No poll message found!");
        return;
      }

      const dayFields = [
        "sunday_count",
        "monday_count",
        "tuesday_count",
        "wednesday_count",
        "thursday_count",
        "friday_count",
        "saturday_count",
      ];

      const channel = client.channels.cache.get(testChannelId);
      const lastPollMessage = await channel.messages.fetch(lastPoll.message_id);

      const reactionsArray = Array.from(
        lastPollMessage.reactions.cache.values()
      );

      for (let index = 0; index < reactionsArray.length; index++) {
        // const emojiName = reaction._emoji.name;
        // const emojiCount = reaction.count;
        const dayField = dayFields[index];
        const reactionUsers = await reactionsArray[index].users.fetch();

        for (const rxnUser of reactionUsers.values()) {
          let user = await discordUser.findOne({
            discord_user_id: rxnUser.id,
          });
          if (!user) {
            try {
              const newDayCount = new dayCount();
              await newDayCount.save();
              const doc = {
                discord_user_id: rxnUser.id,
                username: rxnUser.username,
                day_counts: newDayCount._id,
              };
              user = new discordUser(doc);
              await user.save();
              console.log("New user saved:", user);
            } catch (error) {
              console.error("Error saving new user:", error);
            }
          }

          if (dayField && user) {
            const userDayCount = await dayCount.findById(user.day_counts);

            if (userDayCount) {
              userDayCount[dayField] += 1;
              await userDayCount.save();
            }
          }
        }
      }
    });
  },
};
