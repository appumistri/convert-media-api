var shell = require('shelljs');
const wsUtils = require('./wss');

exports.convert = (id, sourceFilename, destFilename, baseUrl) => {
    try {
        console.log(__dirname);
        let cmd = "ffmpeg -y -i " + sourceFilename + " -preset ultrafast " + destFilename;
        shell.cd('files');
        shell.cd(id);
        // shell.exec('ls -a');
        shell.exec(cmd);
        shell.cd('../../');
        let fileUrl = baseUrl + '/files/' + id + '/' + destFilename;
        wsUtils.send(id, fileUrl);
    } catch (e) {
        wsUtils.send(id, 'media conversion failed');
        console.log(e);
    }
}