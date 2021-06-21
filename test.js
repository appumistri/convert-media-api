const shell = require('shelljs');

let cmd = "ffmpeg -y -i Sample.mp4 -preset ultrafast Sample.mov";

shell.exec(cmd);