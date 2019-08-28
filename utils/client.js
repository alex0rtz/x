const io = require('socket.io-client');

const fs = require('fs');

const ethernet = require('./ethernet');
const IP = ethernet.ip();
const PORT = process.env.PORT;

let socket;

function list() {
    let data = fs.readFileSync('./data/connected.with.json');
    return (data.length > 0) ? JSON.parse(data) : [];
}

function issetConnection(ip, port) {
    return (list().some(item => item.serverIp === IP && item.serverPort === PORT && item.clientIp === ip && item.clientPort === port)) 
}

function add(ip, port) {
    let listConnections = list();

    listConnections.push({ serverIp: IP, serverPort: PORT, clientIp: ip, clientPort: port });

    fs.writeFileSync('./data/connected.with.json', JSON.stringify(listConnections));
}

exports.connect = (ip, port) => {
    add(ip, port);

    socket = io.connect(`http://${ip}:${port}`, {reconnect: true, query: `ip=${IP}&port=${PORT}`});

    socket.on('connect', function(socket) {
        console.log(`Connected to ${ip}:${port}`);
    })
}

exports.isset = issetConnection;