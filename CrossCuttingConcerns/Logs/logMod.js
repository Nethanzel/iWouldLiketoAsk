const crossCutting = require("../data.js");


async function writeLog(level, details) {
    await crossCutting.insertError(`(${level}) (${new Date()}) <${details}>`);
    await crossCutting.updateRecord("nError", 1);
    return null;
}

async function readLogs() {
    let logs = await crossCutting.getErrors();
    await crossCutting.updateRecord("nError", 0);
    await crossCutting.insertError(`<========READED (${new Date()})========>`);
    return logs;
}

async function statusLog() {
    let logStatus = await crossCutting.getRecord("nError");
    return parseInt(logStatus[0]);
}

async function newReport() {
    await crossCutting.updateRecord("nReport", 1);
}

async function reportStatusLog() {
    let logStatus = await crossCutting.getRecord("nReport");
    return parseInt(logStatus[0]);
}

async function reportReaded() {
    await crossCutting.updateRecord("nReport", 0);
    return null;
}

let onLoad = true;
async function setRecord(newRecord) {
    if(!onLoad) {
        if(newRecord > record) {
            await crossCutting.updateRecord("onlines", newRecord);
            record = newRecord;
        }
        return null;
    }
    onLoad = false;
}

let record = 0;
function getRecord() {
    return parseInt(record);
}

async function getTokens() {
    let res = await crossCutting.getTokens();
    return res;
}

async function getBlacklist() {
    let res = await crossCutting.getBlacklist();
    return res;
}

setTimeout(async function () {
    let res = await crossCutting.getRecord("onlines");
    record = res[0];
}, 100)

module.exports.writeLog = writeLog;
module.exports.readLogs = readLogs;
module.exports.statusLog = statusLog;
module.exports.reportStatusLog = reportStatusLog;
module.exports.reportReaded = reportReaded;
module.exports.setRecord = setRecord;
module.exports.getRecord = getRecord;
module.exports.getTokens = getTokens;
module.exports.getBlacklist = getBlacklist;
module.exports.newReport = newReport;