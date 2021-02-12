const mongo = require("mongoose");

const Answer = require("./models/answersModel.js");
const Report = require("./models/reportsModel.js");
const Question = require("./models/questionModel.js");
const eLog = require("../../CrossCuttingConcerns/Logs/logMod.js");
const { updateRecord, getRecord } = require("../../CrossCuttingConcerns/data.js");

let qCache = undefined;

mongo.set('useNewUrlParser', true);
mongo.set('useUnifiedTopology', true);

mongo.connect(process.env.DB) 
.then(() => {
    console.log("DB connection is up.");
    qCache = getQuestions();
})
.catch(e => {
    eLog.writeLog("data/connection error", e);
})


function saveAnswers(answers) {
    try {
        let gAnswers = JSON.parse(answers.answers);
        answers.answers = gAnswers
        let inComing = new Answer(answers);
        inComing.save((err, doc) => {
            if(err) {
                eLog.writeLog("data/s-answers error", JSON.stringify(answers) + "\n" + err);
            }
        });
        return true;
    } catch (error) {
        eLog.writeLog("data/answers error", error);
        return false;
    }
}

async function getQuestions() {
    try {
        let Questions = await Question.find();

        if(Questions) {
            return Questions;
        } else return null;
    } catch (error) {
        eLog.writeLog("data/questions error", error);
        return null;
    }
}

function saveReport(report) {
    try {
        let inComing = new Report(report);
        inComing.save((err, doc) => {
            if(err) {
                eLog.writeLog("data/s-report error", JSON.stringify(report) + "\n" + err);
            }
        });
        return true;
    } catch (error) {
        eLog.writeLog("data/report error", error);
        return false;
    }
}

function questionsInterface() {
    if(qCache) {
        return qCache;
    } else return null;
}

function qUpdate() {
    qCache = getQuestions()
}

async function updateParams(newParams) {

    let max = newParams.max;
    let ruler = newParams.ruler;
    let dist = 1;

    if(max.includes("/") > -1) {
        let x = max.split("/");
        max = x[0];
        dist = x[1];
    }

    let nParams = [max, dist, ruler]
    let res = await updateRecord("params", nParams);

    if(res.n != 0) {
        return true;
    } else return false;
}

async function readParams() {
    let params = await getRecord("params")
    return params;
}

async function answerCount() {
    let res = await Answer.countDocuments();
    return res;
}

async function getAnswers() {
    let answers = await Answer.find();
    return answers;
}

async function clientStatus(token) {
    let clientAnswers = await Answer.findOne({client: token});

    if(clientAnswers) {
        return true;
    } else return false;
}

module.exports.saveAnswers = saveAnswers;
module.exports.getQuestions = questionsInterface;
module.exports.saveReport = saveReport;
module.exports.qUpdate = qUpdate;
module.exports.updateParams = updateParams;
module.exports.readParams = readParams;
module.exports.answerCount = answerCount;
module.exports.getAnswers = getAnswers;
module.exports.clientStatus = clientStatus;