const connectionHandler = require('./connectionHandler');
const broadcastConnection = require('./broadcastConnection');

const wsController = (aWss) => (ws, req) => {
    ws.on('message', (msg) => {
        msg = JSON.parse(msg);
        switch (msg.method) {
            case "connection":
                connectionHandler(ws, msg, aWss);
                break;
            case "draw":
                broadcastConnection(ws, msg, aWss);
                break;
        }
    })
};

module.exports = wsController