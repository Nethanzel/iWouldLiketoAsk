const AnswersModel = require("./models/answersModel.js");
const dataOptions = require("./dataAcces.js");
const QuestionsModel = require("./models/questionModel.js")

async function generateSummary() {
    let answers = await dataOptions.getAnswers();
    let params = await dataOptions.readParams();
    let ruler = params[2];

    let rawAnswers = []; //This
    for(let i = 0; i < answers.length; i++) {
        rawAnswers.push(answers[i].answers);
    }

    let questions = await QuestionsModel.find();
    let possibleAnswers = []; //this other
    for(let i = 0; i < questions.length; i++) {
        if(questions[i].question == ruler) {
            possibleAnswers = questions[i].answers;
        }
    }

    let summary = [];
    for(let i = 0; i < possibleAnswers.length; i++) {
        summary.push(0);
    }


    for(let i = 0; i < rawAnswers.length; i++) {
        for(let x = 0; x < rawAnswers[i].length; x++) {
            if(rawAnswers[i][x].question == ruler) {
                let place = rawAnswers[i][x].answer[0];
                let index = possibleAnswers.indexOf(place);
                summary[index] += 1;
            }
        }
    }

    return summary;

}

module.exports.generateSummary = generateSummary;