'use strict';

const passport = require('passport');

module.exports.info = [
    passport.authenticate('bearer', { session: true }),
    (request, response) => {
        response.json({ user_id: request.user.id, name: request.user.name, scope: request.authInfo.scope });
    }
];


module.exports.ping = [
    passport.authenticate('bearer', { session: true }),
    (request, response) => {
        response.status(200);
        response.send('OK');
    }
];

module.exports.devices = [
    passport.authenticate('bearer', { session: true }),
    (request, response) => {

        var r = {
            request_id: "1",
            payload: {
                user_id: "1",
                devices: []
            }
        };
        for (var i in global.devices) {
            r.payload.devices.push(global.devices[i].getData());
        }

        response.status(200);
        response.send(r);
    }
];

module.exports.query = [
    passport.authenticate('bearer', { session: true }),
    (request, response) => {
        const r = {
            request_id: '1',
            payload: {
                devices: []
            }
        };
        for (let i in request.body.devices) {
            r.payload.devices.push(global.devices[request.body.devices[i].id].getData());
        }
        response.send(r);
    }
];

module.exports.action = [
    passport.authenticate('bearer', { session: true }),
    (request, response) => {
        var r = {
            request_id: "1",
            payload: {
                devices: []
            }
        };

        for (var i in request.body.payload.devices) {
            var id = request.body.payload.devices[i].id;
            var resps = request.body.payload.devices[i].capabilities.map((it) => global.devices[id].recvState(it.state.value, it.type, it.state.instance));
            
            r.payload.devices.push({ id: id, capabilities: resps });
        }

        response.send(r);
    }
];

module.exports.unlink = [
    passport.authenticate('bearer', { session: true }),
    (request, response) => {
        response.status(200);
    }
];