const mongoose = require('mongoose');
const schema = mongoose.Schema;

const CrossCuttungModel = new schema({
    selector: {type: String, require: true, unique: true},
    data: {type: Array, require: true, default: []},
});

module.exports = mongoose.model("CrossCutting", CrossCuttungModel);


//updateOne({ selector: objNameSel }, { $push: { data: nBill } })