require('dotenv').config();

const ethernet = require('./utils/ethernet');
const IP = ethernet.ip();
process.env.PORT = require('./libs/random').number(4000, 4100);
const PORT = process.env.PORT;

require('./utils/server').connect(PORT);
const client = require('./utils/client');

const axios = require('axios');

axios
    .get(`http://${process.env.HQ_SERVER_IP}:${process.env.HQ_SERVER_PORT}/routes?ip=${IP}&port=${PORT}`)
    .then(res => {
        let response = res.data;
        let servers = [];

        if (response.result) {
            servers = response.router;
        }
    
        for (let serverToConnect of servers) {
            if (serverToConnect.port == PORT) {
                continue;
            }

            // console.log(`CONNETION BETWEEN -> CLIENT: ${PORT} <> ${serverToConnect.port}: SERVER`);
            client.connect(serverToConnect.ip, serverToConnect.port);
        }
    });