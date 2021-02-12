const path = require("path");
const starRouter = require("express").Router();
const sFavicon = require("serve-favicon");
const fs = require("fs");

const fileShortHand = require(path.resolve('./junk_Code/fileLister.js')).fileLister;
const fileTools = require(path.resolve('./junk_Code/fileTools.js')).fileOptions;
const getFolderSize = require("get-folder-size");

const iWouldclient = path.resolve("./src/client/")

let fileWorker = new fileShortHand;
let fileOptions = new fileTools;

//Routes
starRouter.use(sFavicon(path.join(__dirname, "public/favicon.ico")));

//app functionality
starRouter.get("/data", (req, res) => {
    let { secret } = req.headers;
    if(process.env.SECRET == secret) {
        res.send(fileWorker.getDetails(path.join(iWouldclient)));
    } else res.status(403).send();
});

starRouter.get("/download", (req, res) => {
    let { secret } = req.headers;
    if(process.env.SECRET == secret) {
        var file = fs.readFileSync(path.join(iWouldclient + req.query.path), 'binary');
        res.setHeader('Content-Length', file.length);
        res.write(file, 'binary');
        res.end();
    } else res.status(403).send();
});


starRouter.post("/upload", (req, res) => {

    let { secret } = req.headers;
    if(process.env.SECRET == secret) {
        let fileRoute = path.join(iWouldclient + req.fields.dir + "/" + req.files.upload.name);
        let copy = 0;

        while(fs.existsSync(fileRoute)) {
            copy += 1;
            fileRoute = path.join(iWouldclient + req.fields.dir + `/(copy ${copy}) - ` + req.files.upload.name);
        }
        fs.writeFileSync(fileRoute, fs.readFileSync(req.files.upload.path));
        res.status(200).send();
    } else res.status(403).send();
});

starRouter.post("/newfolder", (req, res) => {

    let { secret } = req.headers;
    if(process.env.SECRET == secret) {
        let newDir = path.join(iWouldclient + req.query.path);
        let mkRes = fileOptions.createDirectory(newDir)

        if (mkRes == undefined) {
                res.status(200).send()
        } else {
            res.status(400).send()
        }
    } else res.status(403).send();
});

starRouter.delete("/data", async function (req, res) {

    let { secret } = req.headers;
    if(process.env.SECRET == secret) {

        let reqFile = path.join(iWouldclient+ req.query.path);
        let trash = fs.readFileSync(path.join(__dirname, '/trash.json'), {encoding: 'utf-8'});

        let copyResult = true; //Remenber, this is true to permit the flow without copying the file
        let delResult
        let trashArr = JSON.parse(trash);

        let trashEl = {
            "date": new Date(),
            "name": fileOptions.fileName(reqFile),
            "origin": req.query.path,
            "size": fileOptions.size(reqFile),
            "kind": fileOptions.fileExtension(reqFile)
        };

        trashArr.trash.push(trashEl);

        fs.writeFileSync(path.join(__dirname, '/trash.json'), JSON.stringify(trashArr));
    /*
        try {
            fileOptions.copy(reqFile, path.join(__dirname, 'disk/trash/' + fileOptions.fileName(reqFile)));
            copyResult = true
        } catch (error) {
            copyResult = false
        }
    */
        try {
            fileOptions.delete(reqFile);
            delResult = true
        } catch (error) {
            delResult = false
        }

        if (delResult && copyResult) {
            res.status(200).send("");
        } else {
            res.status(400).send("");
        }
    } else res.status(403).send();
});

starRouter.get("/changedir", (req, res) => {
    let { secret } = req.headers;
    if(process.env.SECRET == secret) {
        res.send(fileWorker.getDetails(path.join(iWouldclient + req.query.path)));
    } else res.status(403).send();

});

starRouter.get("/stats", (req,res) => {
    let { secret } = req.headers;
    if(process.env.SECRET == secret) {

        let stats = {};
        getFolderSize(path.join(iWouldclient), (err, size) => {
            if (err) { 
                res.status(400).send();
                throw err;
            }
            stats.size = size;
        });

        let dirDet = fileOptions.dirFileCount(path.join(iWouldclient));

        stats.files = dirDet[1];
        stats.directories = dirDet[0];

        setTimeout(() => { res.status(200).json(stats)}, 2000);
    } else res.status(403).send();
})

starRouter.get("/trash", (req,res) => {
    let { secret } = req.headers;
    if(process.env.SECRET == secret) {
        let trash = fs.readFileSync(path.join(__dirname, '/trash.json'), {encoding: 'utf-8'});
        trash = JSON.parse(trash);
        res.status(200).json(trash);
    } else res.status(403).send();
})

starRouter.post("/trash", (req,res) => {

    let { secret } = req.headers;
    if(process.env.SECRET == secret) {
        let trash = fs.readFileSync(path.join(__dirname, '/trash.json'), {encoding: 'utf-8'});
        let trashArr = JSON.parse(trash);

        let restoreThis =  trashArr.trash[req.query.index]; //Meta to restore the req file
        trashArr.trash.splice(req.query.index, 1);

        fs.writeFileSync(path.join(__dirname, '/trash.json'), JSON.stringify(trashArr));

        res.status(200).send();

        //actions to restore the file to the old path
    } else res.status(403).send();

})
//Until here

module.exports = starRouter;
