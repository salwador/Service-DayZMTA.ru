const MTAInfo = require(`../project_modules/MTAInfo`);

////////////////////////////////

const fetch = require(`node-fetch`);
const buildQuery = require(`http-build-query`);

////////////////////////////////

let ultimateServers = [
    {
        ip: '78.24.223.138',
        port: 22003,
        slots: 40
    },
    {
        ip: '193.33.87.157',
        port: 22003,
        slots: 40
    },
    {
        ip: '68.168.210.89',
        port: 22003,
        slots: 40
    },
];

let zeroToken = `5bb472cac08c6a9637f229bfaca5ab9b2215ead514453203cf315341e8ba4eb9c1e67138747795a6ccf25`;

////////////////////////////////

const fetchPost = async function(url, options = {}) {
    let query = buildQuery(options);

    let result = await fetch(`${url}?${query}`,
        {
            method: 'POST'
        }
    );

    return result;
};

let refreshZeroWidget = async function () {
    let totalOnline = 0;
    let totalSlots = 0;

    let body = {
        title: `IP адреса и текущий онлайн наших серверов.`,

        head: [],
        body: []
    };

    for (let serverID in ultimateServers) {
        let serverNumber = parseInt(serverID) + 1;
        let serverInfo = ultimateServers[serverID];
        let liveServerInfo = await MTAInfo.getStatus(serverInfo.ip, serverInfo.port);

        if (!liveServerInfo) {
            body.body.push(
                [
                    {
                        text: `Project Zero #${serverNumber}`,
                    },
                    {
                        text: `${serverInfo.ip}:${serverInfo.port}`
                    },
                    {
                        text: `Оффлайн`
                    }
                ]
            );
            continue;
        };

        totalSlots = parseInt(totalSlots) + parseInt(liveServerInfo.max_players);
        totalOnline = parseInt(totalOnline) + parseInt(liveServerInfo.players);

        body.body.push(
            [
                {
                    text: `Project Zero #${serverNumber}`,
                },
                {
                    text: `${serverInfo.ip}:${serverInfo.port}`
                },
                {
                    text: `${liveServerInfo.players}/${liveServerInfo.max_players}`
                }
            ]
        );
    };

    body.head.push(
        {
            text: ""
        },
        {
            text: "",
            align: "right"
        },
        {
            text: `Онлайн (${totalOnline}/${totalSlots})`,
            align: "right"
        },
    )

    let result = await fetchPost(`https://api.vk.com/method/appWidgets.update`,
        {
            v: `5.131`,
            access_token: zeroToken,
            type: `table`,
            code: `return ${JSON.stringify(body)};`
        }
    );

    setTimeout(refreshZeroWidget, 30000, 1);
};

refreshZeroWidget();