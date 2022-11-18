
const Log = require(`../project_modules/Logger/index.js`)
const Auth = require(`../project_configs/serversAuth.js`);
const ServersInfo = require(`../project_utils/ServersInfo.js`);

const MTARemote = require(`../project_modules/MTARemote/index.js`)

//////////////////

const MTASDK = require(`mtasa-sdk`);

//////////////////

Express.addGetAPI(`/api/createPremiumCode`, async function (req, res) {
	let clientIP = req.headers[`cf-connecting-ip`] || req.headers[`x-real-ip`] || req.socket.remoteAddress.split(`:`)[3];
	Log.Info(`"${clientIP}" is call "createPremiumCode" on "${req.query.server}".`);

	let serverName = req.query.server;

	if (!serverName) {
		return res.send({
            error: `"server" parameter not exists`
        });
	};

	if (!ServersInfo.existsByName(serverName)) {
		return res.send({
            error: `"server" parameter is invalid`
        });
	};
	
    const serverInfo = ServersInfo.getByName(serverName);
    const server = new MTASDK(serverInfo.ip, serverInfo.http, Auth.username, Auth.password);

    let value = await MTARemote(server, `getTestValue`, []);

	res.send(value);
});