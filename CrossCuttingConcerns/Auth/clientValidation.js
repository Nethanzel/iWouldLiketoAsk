const CrossCutting = require("../data.js");

async function tokenValidation(token) {
    let res = await CrossCutting.validateToken(token);
    if(res) {
        return true;
    } else return false;
}

async function addToken(token) {
    let res = await CrossCutting.insertToken(token);
    if(res.n != 0) {
        return true
    } else return false;
}

async function removeToken(token) {
    let res = await CrossCutting.deleteToken(token);
    if(res.n != 0) {
        return true;
    } else return false;
}
//================================================================================
async function clientValidation(client) {
    if(client.indexOf(":") > -1) {
        client = client.slice(7, client.length);
    }
    let res = await CrossCutting.validateBlacklist(client);
    if(res) {
        return true;
    } else return false;
}

async function addRejected(client) {
    if(client.indexOf(":") > -1) {
        client = client.slice(7, client.length);
    }
    let res = await CrossCutting.insertBlacklist(client);
    if(res.n != 0) {
        return true
    } else return false;
}

async function removeRejected(client) {
    if(client.indexOf(":") > -1) {
        client = client.slice(7, client.length);
    }
    let res = await CrossCutting.deleteBlacklist(client);
    if(res.n != 0) {
        return true;
    } else return false;
}

module.exports.tokenValidation = tokenValidation;
module.exports.addToken = addToken;
module.exports.removeToken = removeToken;

module.exports.addRejected = addRejected;
module.exports.removeRejected = removeRejected;
module.exports.clientValidation = clientValidation;