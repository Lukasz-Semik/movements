var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  text: String,
  author: { //zmieniamy schema, tak aby user nie wpisywal w komentarzu swojej danej, tylko aby dzialo sie to z automatu.
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
  }
})

module.exports = mongoose.model("Comment", commentSchema);
