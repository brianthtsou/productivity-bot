const cron = require('node-cron');
const { testChannelId } = require("../config.json");

  module.exports = {
    name: 'test5minMessage',
    execute(client) {
      cron.schedule('*/2 * * * *', () => {
        const now = new Date();
        const channel = client.channels.cache.get(testChannelId);
        console.log(channel);
        if (channel) {
          channel.send(`Hello, another hour has passed! The current datetime is ${now.toString()}`);
        } else {
          console.log('Channel not found');
        }
      }, {
        scheduled: true,
        timezone: "America/Los_Angeles"
      });
    }
};