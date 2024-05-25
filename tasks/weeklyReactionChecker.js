const cron = require("node-cron");
const { testChannelId, customEmojiIdList } = require("../config.json");
const weeklyPollMessage = require("../models/weeklyPollMessage");
const discordUser = require("../models/discordUser");

module.exports = {
  name: "weeklyReactionChecker",
  execute(client) {
    cron.schedule("* * * * *", async () => {
      const lastPoll = await weeklyPollMessage.findOne();

      console.log(lastPoll);
      console.log("Hi1");
      if (!lastPoll) {
        console.log("No poll message found!");
        return;
      }

      const channel = client.channels.cache.get(testChannelId);
      const lastPollMessage = await channel.messages.fetch(lastPoll.message_id);
      // console.log(lastPollMessage);

      const dayFields = [
        "sunday_count",
        "monday_count",
        "tuesday_count",
        "wednesday_count",
        "thursday_count",
        "friday_count",
        "saturday_count",
      ];

      const reactions = lastPollMessage.reactions.cache.forEach(
        async (reaction, index) => {
          const emojiName = reaction._emoji.name;
          const emojiCount = reaction.count;
          const dayField = dayFields[index];
          const reactionUsers = await reaction.users.fetch();
          console.log(reactionUsers);
          // console.log(emojiName);
          // console.log(emojiCount);
          // console.log(reactionUsers);
          // console.log(reaction);
          reactionUsers.forEach(async (rxnUser) => {
            let user = await discordUser.findOne();
            console.log(rxnUser.username);
          });
        }
      );
    });
  },
};
