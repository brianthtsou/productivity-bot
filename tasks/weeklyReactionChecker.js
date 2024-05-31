const cron = require("node-cron");
const moment = require("moment");
const { testChannelId, customEmojiIdList } = require("../config.json");
const weeklyPollMessage = require("../models/weeklyPollMessage");
const discordUser = require("../models/discordUser");
const dayCount = require("../models/dayCount");

function getTimeRangeForSpecificTimestamp(timestamp) {
  let specificMoment = moment(timestamp);

  let startOfTimestamp = specificMoment.clone().subtract(1, "minutes"); // 1 minute before
  let endOfTimestamp = specificMoment.clone().add(1, "minutes"); // 1 minute after

  return { start: startOfTimestamp.toDate(), end: endOfTimestamp.toDate() };
}

function getPreviousSundayRange() {
  let now = moment(); // current time
  let lastSunday = now
    .clone()
    .subtract(now.day() + 7, "days")
    .startOf("day")
    .hour(18); // go back to last Sunday, 6 PM
  let startOfLastSunday = lastSunday.clone().startOf("hour"); // last Sunday at exactly 6 PM
  let endOfLastSunday = lastSunday.clone().endOf("hour"); // last Sunday just before 7 PM

  return { start: startOfLastSunday.toDate(), end: endOfLastSunday.toDate() };
}

module.exports = {
  name: "weeklyReactionChecker",
  execute(client) {
    cron.schedule("* * * * *", async () => {
      const { start, end } = getTimeRangeForSpecificTimestamp(
        "2024-05-26T00:27:55.579Z"
      );

      const lastPoll = await weeklyPollMessage.findOne({
        created_at: { $gte: start, $lte: end },
      });

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
        const dayField = dayFields[index];
        const reactionUsers = await reactionsArray[index].users.fetch();
        for (const rxnUser of reactionUsers.values()) {
          if (rxnUser.bot === true) {
            continue;
          }
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
