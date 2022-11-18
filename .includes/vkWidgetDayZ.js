const MTAInfo = require(`../project_modules/MTAInfo`);
const ServersInfo = require("../project_utils/ServersInfo");

////////////////////////////////

const fetch = require(`node-fetch`);
const buildQuery = require(`http-build-query`);
const Server = require("../project_modules/SmartServer");

////////////////////////////////

const serverWidgetIcons = {
    Brown: `27416992_142408`,
    Green: `27416992_142409`,
    Lime: `27416992_142410`,
    Mint: `27416992_142416`,
    Blue: `27416992_142412`,
    Marengo: `27416992_142413`,
    Dark: `27416992_142417`,
    Olive: `27416992_142415`
};

const dayzToken = `d3450a148bb8689d67a15cf4ac72faccd4a01bf439ddbebea817208c1a163c84e70daa217cd44596552b0`;

const allServers = ServersInfo.getAll();

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

    for (let serverInfo of allServers) {
        let liveServerInfo = await MTAInfo.getStatus(serverInfo.ip, serverInfo.port);

        if (!liveServerInfo) {
            body.body.push(
                [
                    {
                        text: `Сервер #${serverInfo.id} «${serverInfo.name}»`,
                        icon_id: serverWidgetIcons[serverInfo.name]
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
                    text: `Сервер #${serverInfo.id} «${serverInfo.name}»`,
                    icon_id: serverWidgetIcons[serverInfo.name]
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