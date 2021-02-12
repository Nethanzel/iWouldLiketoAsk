const mongoose = require('mongoose');
const schema = mongoose.Schema;

const question = new schema({
    question: {type: String},
    answers: {type: Array},
    type: {type: String},
    img: {type: Boolean},
    uri: {type: String}
});

module.exports = mongoose.model("Question", question);