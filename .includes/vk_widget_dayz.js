const fetch = require(`node-fetch`);
const buildQuery = require(`http-build-query`);

////////////////////////////////

let ultimateServers = [
    {
        name: 'Brown',
        ip: '78.24.222.215',
        icon: `27416992_142408`,
        port: 22003,
        slots: 40
    },
    {
        name: 'Green',
        ip: '213.159.209.59',
        icon: `27416992_142409`,
        port: 22003,
        slots: 60
    },
    {
        name: 'Lime',
        ip: '80.87.203.145',
        icon: `27416992_142410`,
        port: 22003,
        slots: 80
    },
    {
        name: 'Mint',
        ip: '194.242.45.35',
        icon: `27416992_142416`,
        port: 22003,
        slots: 80
    },
    {
        name: 'Blue',
        ip: '68.168.210.78',
        icon: `27416992_142412`,
        port: 22003,
        slots: 80
    },
    {
        name: 'Marengo',
        ip: '68.168.210.97',
        icon: `27416992_142413`,
        port: 22003,
        slots: 80
    },
    {
        name: 'Dark',
        ip: '194.242.45.54',
        icon: `27416992_142417`,
        port: 22003,
        slots: 80
    },
    {
        name: 'Olive',
        ip: '213.159.209.20',
        icon: `27416992_142415`,
        port: 22003,
        slots: 80
    },
];

let dayzToken = `d3450a148bb8689d67a15cf4ac72faccd4a01bf439ddbebea817208c1a163c84e70daa217cd44596552b0`;

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

let refreshDayZWidget = async function () {
    let totalOnline = 0;
    let totalSlots = 0;

    let body = {
        title: `IP адреса и текущий онлайн наших серверов.`,

        more: "Как начать играть на MTA DayZ Ultimate?",
        more_url: "https://vk.com/topic-33374332_38189746",

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
                        text: `Сервер #${serverNumber} «${serverInfo.name}»`,
                        icon_id: serverInfo.icon
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
                    text: `Сервер #${serverNumber} «${serverInfo.name}»`,
                    icon_id: serverInfo.icon
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
            access_token: dayzToken,
            type: `table`,
            code: `return ${JSON.stringify(body)};`
        }
    );

    setTimeout(refreshDayZWidget, 30000, 1);
};

refreshDayZWidget();