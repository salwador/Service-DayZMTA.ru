const Cache = require(`../project_modules/Cache/index.js`)
const ServersInfo = require("../project_utils/ServersInfo.js");
const BasesInfo = require("../project_utils/BasesInfo.js");

////////////////////////////////

const fetch = require(`node-fetch`);

////////////////////////////////

const allServers = ServersInfo.getAll();
const allBases = BasesInfo.getAll();

////////////////////////////////

// https://script.google.com/macros/s/AKfycbxHbCdIqxHhKtHDGPjYDzoz6-9uun-cAyWrOS_B2QiX_jortMdYVJt7qI3SsuKRKovHdg/exec

////////////////////////////////

const requestBasesInformation = async function () {
    let result = await fetch(`https://script.google.com/macros/s/AKfycbxHbCdIqxHhKtHDGPjYDzoz6-9uun-cAyWrOS_B2QiX_jortMdYVJt7qI3SsuKRKovHdg/exec`);

    let baseStatusJSON = await result.json();

    if (typeof (baseStatusJSON) != `object`) {
        return {
            error: `error request bases status`
        };
    };

    let cachedBasesInfo = {};

    for (let serverInfo of allServers) {
        let serverBasesInfo = {};

        for (let index in allBases) {
            let baseInfo = allBases[index];
            let baseName = baseInfo.name;

            let leftTime = baseStatusJSON[serverInfo.name][0][index][0];
            let leftRealTime = baseStatusJSON[serverInfo.name][1][index][0];

            serverBasesInfo[baseName] = {
                left: leftTime,
                ending: {
                    year: parseInt(leftRealTime.substring(0, 4)),
                    month: parseInt(leftRealTime.substring(5, 7)),
                    day: parseInt(leftRealTime.substring(8, 10)),
                },
            }
        };

        cachedBasesInfo[serverInfo.name] = serverBasesInfo;
    };

    return cachedBasesInfo;
};

Cache.schedule("requestBasesInformation", requestBasesInformation, 60000 * 2);

////////////////////////////////

Express.addGetAPI([
    `/api/bases/getBasesInfo`,
    `/api/getAllBaseInfo`
], async function (req, res) {
    let baseStatusInfo = await Cache.get(`requestBasesInformation`, requestBasesInformation, 60000 * 2);

    res.send(baseStatusInfo);
});

Express.addGetAPI([
    `/api/bases/getBaseInfo`,
    `/api/getBaseInfo`
], async function (req, res) {
    let base = req.query.base;
    let server = req.query.server;

    if (base) {
        base = base.toUpperCase();
    } else {
        return res.send({
            error: `"base" parameters not exists`
        });
    };

    if (server) {
        server = server.toLowerCase();
        server = `${server.substring(0, 1).toUpperCase()}${server.substring(1, server.length)}`;
    };

    if (server && !ServersInfo.existsByName(server)) {
        return res.send({
            error: `"server" parameters is invalud`
        });
    };

    if (base && !BasesInfo.existsByName(base)) {
        return res.send({
            error: `"base" parameters is invalud`
        });
    };

    let baseStatusInfo = await Cache.get(`requestBaseStatus_${base}`,
        async function () {
            let baseStatusInfo = await Cache.get(`requestBasesInformation`, requestBasesInformation, 60000 * 2);

            let baseInfo = {};

            for (let serverInfo of allServers) {
                baseInfo[serverInfo.name] = baseStatusInfo[serverInfo.name][base];
            };

            return baseInfo;
        }, 30000
    );

    if (server) {
        res.send(baseStatusInfo[server]);
    } else {
        res.send(baseStatusInfo);
    }

});