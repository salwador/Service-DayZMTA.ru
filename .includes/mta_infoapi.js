const fetch = require(`node-fetch`);

////////////////////////////////

let ignoreVersions = new Set();

ignoreVersions.add(`9.9n`);
ignoreVersions.add(`1.6n`);

let fillCacheRequestMTAServersList = async function () {
	let masterList = await fetch("https://mtasa.com/api/");
	let masterJSON = await masterList.json();

	let totalServers = 0;
	let totalPlayers = 0;
	let filteredServers = [];

	for (let serverInfo of masterJSON) {
		filteredServers.push(
			{
				name: serverInfo.name,
				gamemode: serverInfo.gamemode,
				players: serverInfo.players,
				max_players: serverInfo.maxplayers,
				private: serverInfo.password,
				ip: serverInfo.ip,
				port: serverInfo.port
			}
		);

		totalPlayers = totalPlayers + serverInfo.players;
		totalServers = totalServers + 1;
	};

	return {
		players: totalPlayers,
		servers: totalServers,
		serversList: filteredServers
	};
};

////////////////////////////////

Express.addGetAPI(`/api/getServersList`, async function (req, res) {
	let clientIP = req.headers[`x-real-ip`] || req.socket.remoteAddress.split(`:`)[3];
	Log.Info(`"${clientIP}" is request MTA servers list.`);

	let serversInfo = await CacheInfo.get(`requestMTAServersList`, fillCacheRequestMTAServersList, 30000);

	res.send(serversInfo.serversList);
});

Express.addGetAPI(`/api/getServerInfo`, async function (req, res) {
	let clientIP = req.headers[`x-real-ip`] || req.socket.remoteAddress.split(`:`)[3];
	Log.Info(`"${clientIP}" is request info of server "${req.query.ip}:"${req.query.port}.`);

	let ip = req.query.ip;
	let port = req.query.port;

	if (!ip || !port) {
		return res.send({
            error: `"ip" or "port" parameters not exists`
        });
	};

	port = parseInt(port);

	if (!port) {
		return res.send({
            error: `"port" is invalid`
        });
	};

	let serverInfo = await CacheInfo.get(`requestMTAServer_${ip}_${port}`, async function () {
		return await MTAInfo.getStatus(ip, port);
	}, 30000);

	if (!serverInfo) {
		return res.send({
            error: `server "${ip}:${port}" is not exists in monitoring`
        });
	};

	res.send(serverInfo);
});