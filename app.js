'use strict';

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const config = require('./config');
const mqtt = require('mqtt');
const device = require('./device');
const fs = require('fs');
const app = express();
const https = require('https');
const privateKey = fs.readFileSync(config.https.privateKey, 'utf8');
const certificate = fs.readFileSync(config.https.certificate, 'utf8');
const credentials = {
    key: privateKey,
    cert: certificate
};
const httpsServer = https.createServer(credentials, app);
global.devices = [];

if (config.devices) {
    config.devices.forEach(opts => {
        new device(opts);
    });
}

const client = mqtt.connect(`mqtt://${config.mqtt.host}`, {
    port: config.mqtt.port,
    username: config.mqtt.user,
    password: config.mqtt.password
});

app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static('views'));
app.use(cookieParser());
app.use(bodyParser.json({
    extended: false
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(errorHandler());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./auth');
app.get('/', routes.site.index);
app.get('/login', routes.site.loginForm);
app.post('/login', routes.site.login);
app.get('/logout', routes.site.logout);
app.get('/account', routes.site.account);
app.get('/dialog/authorize', routes.oauth2.authorization);
app.post('/dialog/authorize/decision', routes.oauth2.decision);
app.post('/oauth/token', routes.oauth2.token);
app.get('/api/userinfo', routes.user.info);
app.get('/api/clientinfo', routes.client.info);
app.get('/provider/v1.0', routes.user.ping);
app.get('/provider', routes.user.ping);
app.get('/provider/v1.0/user/devices', routes.user.devices);
app.post('/provider/v1.0/user/devices/query', routes.user.query);
app.post('/provider/v1.0/user/devices/action', routes.user.action);
app.post('/provider/v1.0/user/unlink', routes.user.unlink);
httpsServer.listen(config.https.port);

function findIndexByType(arr, elem) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].type === elem) {
            return i;
        }
    }
    return false;
}

const mqttOut = {};

global.devices.forEach(device => {
    device.client = client;

    var mqttData;

    device.data.capabilities.forEach(cap => {
        mqttData = device.data.custom_data.mqtt.find(it => it.instance == cap.state.instance);
        if (mqttData && mqttData.out) {
            mqttOut[mqttData.out] = {
                device: device,
                capability: cap,
                mqtt: mqttData
            };
        }
    })

    device.data.properties.forEach(prop => {
        mqttData = device.data.custom_data.mqtt.find(it => it.instance == prop.parameters.instance);
        if (mqttData && mqttData.out) {
            mqttOut[mqttData.out] = {
                device: device,
                property: prop,
                mqtt: mqttData
            };
        }
    })
});

if (mqttOut) {
    client.on('connect', () => {
        client.subscribe(Object.entries(mqttOut).map(([key, val]) => key));

        client.on('message', (topic, message) => {
            var mqttInst = mqttOut[topic];

            if (mqttInst.capability) {
                mqttInst.capability.state.value = JSON.parse(message);
            } else if (mqttInst.property) {
                mqttInst.property.state = {
                    value: JSON.parse(message),
                    instance: mqttInst.property.parameters.instance
                };
            }
        });
    });

    client.on('offline', () => {
    });
}
module.exports = app;
