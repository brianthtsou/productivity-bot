const mongoose = require("mongoose");

const dayCountSchema = new mongoose.Schema({
  sunday_count: Number,
  monday_count: Number,
  tuesday_count: Number,
  wednesday_count: Number,
  thursday_count: Number,
  friday_count: Number,
  saturday_count: Number,
  total_count: Number,
});

dayCountSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("DayCount", dayCountSchema);
