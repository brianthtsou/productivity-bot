const mongoose = require("mongoose");

const weeklyPollMessageSchema = new mongoose.Schema({
  message_id: String,
  created_at: Date,
});

weeklyPollMessageSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("WeeklyPollMessage", weeklyPollMessageSchema);
