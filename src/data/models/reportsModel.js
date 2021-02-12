const mongoose = require('mongoose');
const schema = mongoose.Schema;

const report = new schema({

  where: {type: String},
  desc: {type: String},
  screen: {type: String},
  client: {type: String, require: true},
  date: {type: Date, require: true}
});

module.exports = mongoose.model("Report", report);