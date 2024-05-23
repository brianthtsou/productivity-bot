const cron = require("node-cron");
const { testChannelId, customEmojiIdList } = require("../config.json");
const weeklyPollMessage = require("../models/weeklyPollMessage");

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

      const reactions = lastPollMessage.reactions.cache.forEach(
        async (reaction) => {
          const emojiName = reaction._emoji.name;
          const emojiCount = reaction.count;
          const reactionUsers = await reaction.users.fetch();
          console.log(reactionUsers);
          // console.log(emojiName);
          // console.log(emojiCount);
          // console.log(reactionUsers);
          // console.log(reaction);
          reactionUsers.forEach((user) => {
            console.log(user.username);
          });
        }
      );
    });
  },
};
