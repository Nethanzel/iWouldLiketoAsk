const routes = require("express").Router();
const connections = require("../index");
const cors = require("cors");

routes.use(cors({origin: "*"}));

const path = require("path");
const fs = require("fs");

const validation = require("../CrossCuttingConcerns/Auth/clientValidation.js");
const eLog = require("../CrossCuttingConcerns/Logs/logMod.js");
const { qUpdate, updateParams } = require("../src/data/dataAcces");

routes.get("/stats", async (req, res) => {
    try {
        let { secret } = req.headers;
        if(process.env.SECRET === secret) {
            let stats = {
                "online": connections.currentConnections(),
                "err_log": await eLog.statusLog(),
                "reports": await eLog.reportStatusLog(),
                "maxOnline": eLog.getRecord(),
            }
            res.status(200).json(stats);
        } else res.status(401).send()
    } catch (error) {
        eLog.writeLog("remote error", error);
        res.status(500).send()
    }
});

routes.get("/onlines", (req, res) => {
    try {
        let { secret } = req.headers;
        if(process.env.SECRET === secret) {
            let stats = {
                online: connections.currentConnections()
            }
            res.status(200).json(stats);
        } else res.status(401).send()
    } catch (error) {
        eLog.writeLog("remote error", error);
        res.status(500).send()
    }
});

routes.get("/tokens", async (req, res) => {
    try {
        let { secret } = req.headers;
        if(process.env.SECRET === secret) {
            let tokenLog = await eLog.getTokens()
            let stats = {
                tokens: tokenLog,
            }
            res.status(200).json(stats);
        } else res.status(401).send()
    } catch (error) {
        eLog.writeLog("remote error", error);
        res.status(500).send()
    }
});


routes.delete("/tokens", async (req, res) => {
    try {
        let { secret, token } = req.headers;
        if(process.env.SECRET === secret) {
            if(validation.tokenValidation(parseInt(token))) {
                let dRes = await validation.removeToken(parseInt(token));
                if(dRes) {res.status(204).send()} else {res.status(404).send()}
            } else res.status(404).send();
        } else res.status(401).send()
    } catch (error) {
        eLog.writeLog("remote error", error);
        res.status(500).send()
    }

});


routes.get("/connections", (req, res) => {
    try {
        let { secret } = req.headers;
        if(process.env.SECRET === secret) {
            let connLog = fs.readFileSync(path.resolve("./CrossCuttingConcerns/Logs/connections.json"), {encoding: 'utf-8'});
            let stats = {
                connections: JSON.parse(connLog)
            }

            let connArr = JSON.parse(connLog);
            connArr.connections.push({READED: `<======(${new Date()})======>`});
            fs.writeFileSync(path.resolve("./CrossCuttingConcerns/Logs/connections.json"), JSON.stringify(connArr));

            res.status(200).json(stats);
        } else res.status(401).send()
    } catch (error) {
        eLog.writeLog("remote error", error);
        res.status(500).send()
    }

});


routes.get("/errors", async (req, res) => {
    try {
        let { secret } = req.headers;
        if(process.env.SECRET === secret) {
            let errLog = await eLog.readLogs();
            let stats = {
                logs: errLog
            }
            res.status(200).json(stats);
        } else res.status(401).send()
    } catch (error) {
        eLog.writeLog("remote error", error);
        res.status(500).send()
    }
});

routes.get("/blacklist", async (req, res) => {
    try {
        let { secret } = req.headers;
        if(process.env.SECRET === secret) {
            let bList = await eLog.getBlacklist();
            res.status(200).json(bList);
        } else res.status(401).send()
    } catch (error) {
        eLog.writeLog("remote error", error);
        res.status(500).send()
    }
});

routes.post("/blacklist", async (req, res) => {
    try {
        let { secret, ip } = req.headers;
        if(process.env.SECRET === secret) {
            let vRes = await validation.addRejected(ip);
            if(vRes) {res.status(204).send()} else {res.status(404).send()}
        } else res.status(401).send()
    } catch (error) {
        eLog.writeLog("remote error", error);
        res.status(500).send()
    }
});


routes.delete("/blacklist", async (req, res) => {
    try {
        let { secret, ip } = req.headers;
        if(process.env.SECRET === secret) {
            let vRes = await validation.clientValidation("::ffff:" + ip);
            if(vRes) {
                res.status(204).send();
                validation.removeRejected(ip);
            } else return res.status(404).send();
        } else res.status(401).send()
    } catch (error) {
        eLog.writeLog("remote error", error);
        res.status(500).send()
    }
});


routes.get("/questions", (req, res) => {
    try {
        let { secret } = req.headers;
        if(process.env.SECRET === secret) {
            qUpdate()
            res.status(204).send();
        } else res.status(401).send()
    } catch (error) {
        eLog.writeLog("remote error", error);
        res.status(500).send()
    }
});

routes.get("/reports", (req, res) => {
    try {
        let { secret } = req.headers;
        if(process.env.SECRET === secret) {
            eLog.reportReaded();
            res.status(204).send();
        } else res.status(401).send()
    } catch (error) {
        eLog.writeLog("remote error", error);
        res.status(500).send()
    }
});

routes.post("/params", async (req, res) => {
    try {
        let { secret } = req.headers;
        let values = req.fields;
        if(process.env.SECRET === secret) {
            let uRes = await updateParams(values.parameters);
            if (uRes) {res.status(204).send()} else {res.status(404).send()}
        } else res.status(401).send()
    } catch (error) {
        eLog.writeLog("remote error", error);
        res.status(500).send()
    }
});

routes.get("/views/:name", (req, res) => {
    try {
        let { secret } = req.headers;
        if(process.env.SECRET === secret) {
            let fName = req.params.name;
            let screensDir = path.resolve("./CrossCuttingConcerns/Logs/clientReports/" + fName);
            if(fs.existsSync(screensDir)) {
                res.status(200).sendFile(screensDir);
            } else res.status(404).send();
        } else res.status(401).send()
    } catch (error) {
        eLog.writeLog("remote error", error);
        res.status(500).send()
    }
});

module.exports = routes;
