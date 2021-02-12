const routes = require("express").Router();

const eLog = require("../Logs/logMod.js");

const clientValidation = require("./clientValidation");
const addToken = clientValidation.addToken;
const removeToken = clientValidation.removeToken;
const validateToken = clientValidation.tokenValidation;

routes.get("/", (req, res) => {
    try {
        let newToken = new Date().getTime();
        if(addToken(newToken)) {
            res.setHeader("token", newToken);
            res.status(204).send();
        } else {
            res.status(500).send();
        }
    } catch (error) {
        eLog.writeLog("auth error", error);
        res.status(500).send()
    }
});

routes.delete("/", (req, res) => {
    try {
        let { token } = req.headers;
        token = parseInt(token);
        if(validateToken(token)) {
            removeToken(token)
            res.status(204).send()
        } else res.status(404).send();
    } catch (error) {
        eLog.writeLog("auth error", error);
        res.status(500).send()
    }
});

module.exports = routes;