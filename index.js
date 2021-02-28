require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const history = require('connect-history-api-fallback');
const path = require("path");
const fs = require("fs");
const sFavicon = require("serve-favicon");

require("./src/data/dataAcces");

const validation = require("./CrossCuttingConcerns/Auth/clientValidation.js");
const routes = require("./src/api/Routes.js");
const authRoutes = require("./CrossCuttingConcerns/Auth/routes.js");
const remotes = require("./remote/routes.js");
const starRoutes = require("./remote/StarDrive/routes.js");
const CrossCutting = path.join(__dirname, "CrossCuttingConcerns/");
const eLog = require("./CrossCuttingConcerns/Logs/logMod.js");

let onlineCount = 0;
const service = express();

service.set("PORT", process.env.PORT || 80);
service.use(formidable());
service.use(sFavicon(path.join(__dirname, "src/client/favicon.ico")))

service.all("*", async (req, res, next) => {

    if (req.path != "/favicon.ico") {
        let userIP = req.ip;
        let customDate = new Date();
        let hours = customDate.getHours()
        customDate.setHours(hours - 4)

        let connectionDetails = {
            ip: userIP,
            date: customDate,
            method: req.method,
            path: req.path
        }
        let { token } = req.headers
        if(token) {
            connectionDetails.token = token;
        }
        let vRes = await validation.clientValidation(userIP);
        if(vRes) {
            return res.status(403).send();
        }
        let conn = fs.readFileSync(path.join(CrossCutting, "Logs/connections.json"), {encoding: 'utf-8'});
        let connArr = JSON.parse(conn);

        connArr.connections.push(connectionDetails);
        fs.writeFileSync(path.join(CrossCutting, "Logs/connections.json"), JSON.stringify(connArr));
        next();
    }
});

service.use("/api", routes);
service.use("/auth", authRoutes);
service.use("/rem", remotes);
service.use("/drive", starRoutes);

service.use('/drive/', express.static(path.join(__dirname, "remote/StarDrive/public")));
service.use(history());
service.use("/", express.static(path.join(__dirname, "src/client")));

const app = service.listen(service.get("PORT"), ()=> {
    console.log("The service is running on port ", service.get("PORT"));
});

const io = require("socket.io")(app);

io.on("connection", client => {
    onlineCount++;
    eLog.setRecord(onlineCount);
    client.on("disconnect", function() { onlineCount--; });
});

function currentConnections() {
    return onlineCount;
}

module.exports.currentConnections = currentConnections;