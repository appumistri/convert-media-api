var shell = require('shelljs');
const wssClients = [];

exports.connect = ws => {
    console.log('connected');
    ws.on('message', message => {
        console.log('received:', message);
        wssClients.push({client: ws, id: message});
    });

};

exports.send = send;

function send(id, fileUrl) {

    const wssClient = wssClients.find(client => client.id === id);

    if (wssClient !== null && wssClient !== undefined) {
        wssClient.client.send(fileUrl);
    }
}

exports.convert = data => {
    try {
        console.log(JSON.stringify(data));
        let cmd = "ffmpeg -y -i " + data.srcFilename + " -flags +global_header -preset ultrafast " + data.destFilename;
        shell.cd('files');
        shell.cd(data.id);
        shell.exec('ls -a');
        console.log(cmd);
        shell.exec(cmd);
        shell.cd('../../');
        let fileUrl = data.baseUrl + '/files/' + data.id + '/' + data.destFilename;
        send(data.id, fileUrl);
    } catch (e) {
        send(data.id, 'media conversion failed');
        console.log(e);
    }
}
