const mongoose = require("mongoose");
const diarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

// exporting out model, we are calling it "Diary" and the schema would be diarySchema which we created here
module.exports = mongoose.model("Diary", diarySchema);
