const mongoose = require('mongoose');
const schema = mongoose.Schema;

const answer = new schema({

  answers: {type: Array, require: true},
  client: {type: String, require: true, unique: true},
  date: {type: Date, require: true},
  seem: {type: Boolean, default: false}
});

module.exports = mongoose.model("Answer", answer);