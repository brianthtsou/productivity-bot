const mongoose = require("mongoose");

const dayCountSchema = new Schema({
  sunday_count: { type: Number, default: 0 },
  monday_count: { type: Number, default: 0 },
  tuesday_count: { type: Number, default: 0 },
  wednesday_count: { type: Number, default: 0 },
  thursday_count: { type: Number, default: 0 },
  friday_count: { type: Number, default: 0 },
  saturday_count: { type: Number, default: 0 },
  total_count: { type: Number, default: 0 },
});

dayCountSchema.pre("save", function (next) {
  this.total_count =
    this.sunday_count +
    this.monday_count +
    this.tuesday_count +
    this.wednesday_count +
    this.thursday_count +
    this.friday_count +
    this.saturday_count;
  next();
});

dayCountSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("DayCount", dayCountSchema);
