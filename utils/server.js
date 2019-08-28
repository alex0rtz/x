const http = require('http');
var io = require('socket.io');

const fs = require('fs');
const moment = require('moment');

const random = require('../libs/random');

const client = require('./client');

const list = _ => {
    let data = fs.readFileSync('./data/router.ip.json');
    return (data.length > 0) ? JSON.parse(data) : [];
}

exports.connect = port => {
    const server = http.createServer(function(){});
    server.listen(port);

    console.log(`Running on port ${port}`);

    io = io.listen(server);

    io.sockets.on('connection', function (socket) {
        let query = socket.handshake.query;
        
        if (!client.isset(query.ip, query.port)) {
            client.connect(query.ip, query.port);
        }

        console.log(`[${port}] : A client has connected (${query.ip}:${query.port})`);

        socket.on('disconnect', _ => console.log("Disconnected"));
    });

    return server;
}

exports.add = (ip, port) => {
    let routesTable = list();

    if (routesTable.some(route => route.ip === ip && route.port === port)) {
        return;
    }

    routesTable.push({ id: +`${moment().unix()}${random.number(1, 200)}`, ip, port });

    fs.writeFileSync('./data/router.ip.json', JSON.stringify(routesTable));
};

exports.list = list;