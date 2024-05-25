const mongoose = require("mongoose");
const dayCount = require("./dayCount");

const discordUserSchema = new mongoose.Schema({
  username: String,
  discord_user_id: String,
  dayCounts: { type: Schema.Types.ObjectId, ref: "DayCount" },
});

discordUserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("DiscordUser", discordUserSchema);
