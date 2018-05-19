var mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var campgroundSchema = new Schema({
  name: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});
module.exports = mongoose.model("Campground", campgroundSchema);
