const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const { uuid } = require('uuidv4');
const converter = require('./converter');
const WebSocket = require('ws');
const wsUtils = require('./wss');
var NRP = require('node-redis-pubsub');


const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/files', express.static('files'))
app.use(bodyParser.urlencoded({ extended: true }));


//start app 
const port = process.env.PORT || 3000;

const server = app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
);

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => wsUtils.connect(ws));


/* Redis config */
var config = {
    port: 6379,
    host: '127.0.0.1'
};

var nrp = new NRP(config);

nrp.on('start_media_conversion', (data) => {
    console.log(data);
    converter.convert(data.id, data.srcFilename, data.destFilename, data.baseUrl);
});

app.post('/upload-media', async (req, res) => {
    try {
        if (!req.files) {
            res.status(404).send({
                message: 'File not found'
            });
        } else {
            //Use the name of the input field (i.e. "media") to retrieve the uploaded file
            let media = req.files.media;

            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            let id = req.body.id || uuid();
            let srcFilename = media.name;
            media.mv('files/' + id + '/' + srcFilename);
            let destFilename = srcFilename.split('.')[0] + '.' + req.body.convertTo;
            let baseUrl = 'http://' + req.hostname;

            nrp.emit('start_media_conversion', { id: id, srcFilename: srcFilename, destFilename: destFilename, baseUrl: baseUrl });

            //send response
            res.send({
                message: 'File is being processed',
                data: {
                    processingId: id,
                    name: media.name,
                    mimetype: media.mimetype,
                    size: media.size
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});