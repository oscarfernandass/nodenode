const mongoose = require("mongoose");

// UserInfo Schema
const storySchema = new mongoose.Schema({
    story: String,
});

const storyModel =mongoose.model("story",storySchema);
module.exports=storyModel;

