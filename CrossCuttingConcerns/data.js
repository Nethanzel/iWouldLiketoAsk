const crossModel = require("./model/AuthModel.js");
const logsMod = require("./Logs/logMod.js");

async function getTokens() {
    try {
        let dbTokens = await crossModel.findOne({ selector: "auth" });
        return dbTokens.data;
    } catch (error) {
        logsMod.writeLog("dbLogging", error);
    }

}

async function insertToken(token) {
    try {
        let g0tContainer = await crossModel.findOne({ selector: "auth" });
        if (!g0tContainer) {
            let nConta = new crossModel({ selector: "auth", data: [token] });
            let res = await nConta.save();
            return res;
        } else {
            let insertion = await crossModel.updateOne({ selector: "auth" }, { $push: { data: token } });
            return insertion;
        }
    } catch (error) {
        logsMod.writeLog("dbLogging", error);
    }
}

async function deleteToken(token) {
    try {
        let container = await crossModel.findOne({ selector: "auth" });
        if (container.data.includes(token)) {
            let index = container.data.indexOf(token);
            container.data.splice(index, 1);
        } else return false;

        let res = await crossModel.updateOne({ selector: "auth" }, { data: container.data });
        return res
    } catch (error) {
        logsMod.writeLog("dbLogging", error);
    }
}

async function validateToken(token) {
    try {
        let container = await crossModel.findOne({ selector: "auth" });
        if (container.data.includes(token)) {
                return true;
        } else return false;
    } catch (error) {
        logsMod.writeLog("dbLogging", error);
    }
}


//==================================================================================================


async function getBlacklist() {
    try {
        let dbList = await crossModel.findOne({ selector: "blist" });
        return dbList.data;
    } catch (error) {
        logsMod.writeLog("dbLogging", error);
    }

}

async function insertBlacklist(client) {
    try {
        let g0tContainer = await crossModel.findOne({ selector: "blist" });
        if (!g0tContainer) {
            let nConta = new crossModel({ selector: "blist", data: [client] });
            let res = await nConta.save();
            return res;
        } else {
            let insertion = await crossModel.updateOne({ selector: "blist" }, { $push: { data: client } });
            return insertion;
        }
    } catch (error) {
        logsMod.writeLog("dbLogging", error);
    }
}

async function deleteBlacklist(client) {
    try {
        let container = await crossModel.findOne({ selector: "blist" });
        if (container.data.includes(client)) {
            let index = container.data.indexOf(client);
            container.data.splice(index, 1);
        } else return false;

        let res = await crossModel.updateOne({ selector: "blist" }, { data: container.data });
        return res
    } catch (error) {
        logsMod.writeLog("dbLogging", error);
    }
}

async function validateBlacklist(client) {
    try {
        let container = await crossModel.findOne({ selector: "blist" });
        if (container.data.includes(client)) {
                return true;
        } else return false;
    } catch (error) {
        logsMod.writeLog("dbLogging", error);
    }
}
//===============================================================================

async function getRecord(selector) {
    try {
        let record = await crossModel.findOne({ selector: selector });
        return record.data;
    } catch (error) {
        logsMod.writeLog("dbLogging", error);
    }
}

async function updateRecord(selector, nValue) {
    try {
        let g0tContainer = await crossModel.findOne({ selector: selector });
        if (!g0tContainer) {
            let nConta = new crossModel({ selector: selector, data: [nValue] });
            let res = await nConta.save();
            return res;
        } else {
            let insertion = await crossModel.updateOne({ selector: selector }, { data: nValue });
            return insertion;
        }
    } catch (error) {
        logsMod.writeLog("dbLogging", error);
    }
}
//==================================================================================================
async function getErrors() {
    try {
        let record = await crossModel.findOne({ selector: "error" });
        return record.data;
    } catch (error) {
        logsMod.writeLog("dbLogging", error);
    }
}

async function insertError(nError) {
    try {
        let g0tContainer = await crossModel.findOne({ selector: "error" });
        if (!g0tContainer) {
            let nConta = new crossModel({ selector: "error", data: [nError] });
            let res = await nConta.save();
            return res;
        } else {
            let insertion = await crossModel.updateOne({ selector: "error" }, { $push: { data: nError } });
            return insertion;
        }
    } catch (error) {
        logsMod.writeLog("dbLogging", error);
    }
}


module.exports.getTokens = getTokens;
module.exports.insertToken = insertToken;
module.exports.deleteToken = deleteToken;
module.exports.validateToken = validateToken;

module.exports.getBlacklist = getBlacklist;
module.exports.insertBlacklist = insertBlacklist;
module.exports.deleteBlacklist = deleteBlacklist;
module.exports.validateBlacklist = validateBlacklist;

module.exports.getRecord = getRecord;
module.exports.updateRecord = updateRecord;

module.exports.getErrors = getErrors;
module.exports.insertError = insertError;