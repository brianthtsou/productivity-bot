const cron = require("node-cron");
const { testChannelId, customEmojiIds } = require("../config.json");

module.exports = {
  name: "test5minMessage",
  execute(client) {
    cron.schedule(
      "*/5 * * * *",
      async () => {
        const now = new Date();
        const channel = client.channels.cache.get(testChannelId);
        if (channel) {
          const sentMessage = await channel.send(
            `@everyone Hello, another hour has passed! The current datetime is ${now.toString()}`
          );
          await sentMessage.react(customEmojiIds.sunday);
          await sentMessage.react(customEmojiIds.monday);
          await sentMessage.react(customEmojiIds.tuesday);
          await sentMessage.react(customEmojiIds.wednesday);
          await sentMessage.react(customEmojiIds.thursday);
          await sentMessage.react(customEmojiIds.friday);
          await sentMessage.react(customEmojiIds.saturday);
        } else {
          console.log("Channel not found");
        }
      },
      {
        scheduled: true,
        timezone: "America/Los_Angeles",
      }
    );
  },
};
