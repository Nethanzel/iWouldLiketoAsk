const path = require("path");
const fs = require("fs");

const router = require("express").Router();
const clientValidation = require("../../CrossCuttingConcerns/Auth/clientValidation");
const dataOptions = require("../data/dataAcces");
const summaryMod = require("../data/summary.js");

const eLog = require("../../CrossCuttingConcerns/Logs/logMod.js");

const validateToken = clientValidation.tokenValidation;

router.get("/questions", async (req, res) => {
    try {
        let { token } = req.headers;
        token = parseInt(token);
        let validation = await validateToken(token)
        if(validation) {
            let questions = await dataOptions.getQuestions();
            res.status(200).json({"data": questions})
        } else res.status(401).send();
    } catch (error) {
        eLog.writeLog("api error", error);
        res.status(500).send()
    }
});

router.get("/summary", async (req, res) => {
    try {
        let { token } = req.headers;
        token = parseInt(token);
        let validation = await validateToken(token)
        if(validation) {
            res.status(200).send({"data": summary});
        } else res.status(401).send();
    } catch (error) {
        eLog.writeLog("api error", error);
        res.status(500).send()
    }
});


router.post("/questions", async (req, res) => {
    try {
        let { token } = req.headers;
        token = parseInt(token);
        let validation = await validateToken(token)
        let participation = await dataOptions.clientStatus(token);
        if(validation) {
            if(!participation) {
                let result = req.fields;
                if(dataOptions.saveAnswers(result)) {
                    res.status(204).send()
                } res.status(500).send()
            } else res.status(403).send();
        } else res.status(401).send();
    } catch (error) {
        eLog.writeLog("api error", error);
        res.status(500).send()
    }
});

router.post("/reports", async (req, res) => {
    try {
        let { token } = req.headers;
        token = parseInt(token);
        let validation = await validateToken(token)
        if(validation) {
            let  file  = req.files.screen;
            let report = req.fields;
            if(file) {
                let reportsCaps = path.resolve("./CrossCuttingConcerns/Logs/clientReports");
                let ext = file.name.slice(file.name.lastIndexOf("."), file.name.length)
                let newName = String(new Date().getTime()) + ext;
                let newCapRoute = path.join(reportsCaps, newName);
                report.screen = newName;
                fs.copyFileSync(path.resolve(file.path), newCapRoute);
                setTimeout(() =>{fs.unlinkSync(file.path)}, 7000)
            }
            if(dataOptions.saveReport(report)) {
                res.status(204).send();
                await eLog.newReport()
            } else res.status(500).send();
        } else res.status(401).send();
    } catch (error) {
        eLog.writeLog("api error", error);
        res.status(500).send()
    }
});

router.get("/", async (req, res) => {
    try {
        let { token } = req.headers;
        token = parseInt(token);
        let validation = await dataOptions.clientStatus(token);
        setTimeout(() => {
            if(!validation) {    //know if already have made the answer sent
                res.status(204).send() // if haven't, let it go
            } else res.status(401).send(); // if so, reject the access
        }, 3000)
    } catch (error) {
        eLog.writeLog("api error", error);
        res.status(500).send()
    }
})

setInterval(async function() {
    ansCount = await dataOptions.answerCount();
    townSummary = await summaryMod.generateSummary();
    smParams = await dataOptions.readParams();
    //[[lo que hay, lo que falta], [[cities data...], max]]
    summary =  [[ansCount, (smParams[0] * smParams[1]) - ansCount], [townSummary, [smParams[0],smParams[1]]]];
}, 300000)

let ansCount;
let townSummary;
let smParams;
let summary;

setTimeout(async function() {
    ansCount = await dataOptions.answerCount();
    townSummary = await summaryMod.generateSummary();
    smParams = await dataOptions.readParams();

    summary =  [[ansCount, (smParams[0] * smParams[1]) - ansCount], [townSummary, [smParams[0],smParams[1]]]];
}, 500)

module.exports = router;
