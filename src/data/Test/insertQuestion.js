const mongo = require("mongoose");
const question = require("../models/questionModel.js");

mongo.set('useNewUrlParser', true);
mongo.set('useUnifiedTopology', false);

mongo.connect("mongodb://localhost:27017/iWouldDB") 
.then(() => {console.log("DB connection is up.")})
.catch(e => {
 console.log(e);
})

setTimeout(() => {

    let newQuestion = new question(
        {
            question: "¿Cual es tu nombre?",
            answers: [],
            type: "text",
            img: false
        }
    )

    newQuestion.save((err, doc) => {
        if(err) {
            mongo.disconnect()
            console.log(err);
        } else console.log(doc);
        mongo.disconnect()
    })

}, 5000)
