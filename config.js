module.exports = {

    skill_id: '207cf6eb-7db7-49a5-9808-3cd4223777f4',
    oauth_token: 'y0__xCGvd2OARij9xMg4433yBJF_UPZHieC-xExXLlbVlxAKinIhQ',

    mqtt: {
        host: 'localhost',
        port: 1883,
        user: '',
        password: ''
    },

    https: {
        privateKey: '/etc/letsencrypt/live/octa-smarthome.zapto.org/privkey.pem',
        certificate: '/etc/letsencrypt/live/octa-smarthome.zapto.org/fullchain.pem',
        port: 443
    },

    clients: [
        {
            id: '1',
            name: 'Yandex',
            clientId: 'yandex-wirenboard-1869',
            clientSecret: 'Octaviarius0',
            isTrusted: false
        },
    ],

    users: [{
        id: '1',
        username: 'admin',
        password: 'admin',
        name: 'Administrator'
    },
    {
        id: '2',
        username: 'root',
        password: 'root',
        name: 'Administrator'
    },
    ],

    devices: [
        {
            name: 'Свет в спальне',
            room: 'Спальня',
            type: 'devices.types.light',
            mqtt: [
                {
                    instance: 'on',
                    in: '/devices/yandex-br/bedroom-main-light/enabled/in',
                    out: '/devices/yandex-br/bedroom-main-light/enabled/out'
                },
                {
                    instance: 'temperature_k',
                    in: '/devices/yandex-br/bedroom-main-light/temperature_k/in',
                    out: '/devices/yandex-br/bedroom-main-light/temperature_k/out'
                },
                {
                    instance: 'brightness',
                    in: '/devices/yandex-br/bedroom-main-light/brightness/in',
                    out: '/devices/yandex-br/bedroom-main-light/brightness/out'
                },
            ],
            capabilities: [
                {
                    type: 'devices.capabilities.on_off',
                    retrievable: true,
                    state: {
                        instance: 'on',
                        value: true
                    }
                },
                {
                    type: 'devices.capabilities.range',
                    retrievable: true,

                    parameters: {
                        instance: 'brightness',
                        unit: 'unit.percent',
                        range: {
                            min: 0,
                            max: 100,
                            precision: 1
                        }
                    },
                    state: {
                        instance: 'brightness',
                        value: 10,
                    },
                },
                {
                    type: 'devices.capabilities.color_setting',
                    retrievable: true,
                    parameters: {
                        temperature_k: {
                            min: 2500,
                            max: 8500,
                            precision: 500,
                        }
                    },
                    state: {
                        instance: 'temperature_k',
                        value: 4000
                    },
                },
            ]
        },
        {
            name: 'Атмосфера в спальне',
            room: 'Спальня',
            type: 'devices.types.sensor',
            mqtt: [
                {
                    instance: 'co2_level',
                    out: '/devices/yandex-br/bedroom-atmosphere/co2_level/out'
                },
                {
                    instance: 'tvoc',
                    out: '/devices/yandex-br/bedroom-atmosphere/voc/out'
                },
                {
                    instance: 'humidity',
                    out: '/devices/yandex-br/bedroom-atmosphere/hum/out'
                },
                {
                    instance: 'temperature',
                    out: '/devices/yandex-br/bedroom-atmosphere/temp/out'
                },
                {
                    instance: 'illumination',
                    out: '/devices/yandex-br/bedroom-atmosphere/illumination/out'
                }
            ],
            properties: [
                {
                    type: "devices.properties.float",
                    parameters: {
                        instance: "co2_level",
                        unit: "unit.ppm"
                    }
                },
                {
                    type: "devices.properties.float",
                    parameters: {
                        instance: "tvoc",
                        unit: "unit.ppb"
                    }
                },
                {
                    type: "devices.properties.float",
                    parameters: {
                        instance: "humidity",
                        unit: "unit.percent"
                    }
                },
                {
                    type: "devices.properties.float",
                    parameters: {
                        instance: "temperature",
                        unit: "unit.temperature.celsius"
                    }
                },
                {
                    type: "devices.properties.float",
                    parameters: {
                        instance: "illumination",
                        unit: "unit.illumination.lux"
                    }
                }
            ]
        }
    ]
}
