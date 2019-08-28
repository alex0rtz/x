const app = require('express')();
const bodyParser = require('body-parser');

const server = require('../utils/server');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/routes', (req, res) => {
    let ip = req.query.ip;
    let port = req.query.port;

    let routes = server.list();

    let isset = routes.some(route => route.port === port);

    if (!isset) {
        server.add(ip, port);
    }

    let router = server.list();

    res.status(200).send({
        result: true,
        router,
        counts: router.length
    });
});

const HQ_SERVER = app.listen(3010, _ => {
    console.log(`HQ Server running on port ${HQ_SERVER.address().port}`);
});