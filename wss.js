const wssClients = [];

exports.connect = ws => {
    console.log('connected');
    ws.on('message', message => {
        console.log('received:', message);
        wssClients.push({client: ws, id: message});
    });

};

exports.send = (id, fileUrl) => {

    const wssClient = wssClients.find(client => client.id === id);

    if (wssClient !== null && wssClient !== undefined) {
        wssClient.client.send(fileUrl);
    }
}
