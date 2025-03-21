const utils = require('./utils');

class device {
    constructor(options) {
        var id = global.devices.length;
        this.data = {
            id: options.id || String(id),
            name: options.name || 'Unnamed',
            description: options.description || '',
            room: options.room || '',
            type: options.type || 'devices.types.light',
            custom_data: {
                mqtt: options.mqtt || []
            },
            capabilities: options.capabilities || [],
            properties: options.properties || [],
        }

        global.devices.push(this);
    }

    getData() {
        return this.data;
    };

    recvState(val, type, inst) {
        try {
            var capIdx = this.data.capabilities.findIndex((it) => it.type == type);
            if (capIdx !== -1) {
                this.data.capabilities[capIdx].state.instance = inst;
                this.data.capabilities[capIdx].state.value = val;

                var topic = this.data.custom_data.mqtt.find((it) => it.instance == inst)?.in;
                if (topic) {
                    this.client.publish(topic, utils.convToString(val));
                }
            }
        }
        catch (err) {
            console.error(err);
        }

        return {
            'type': type,
            'state': {
                'instance': inst,
                'action_result': {
                    'status': 'DONE'
                }
            }
        };
    };
}
module.exports = device;
