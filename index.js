console.log("Starting project...")

////////////////////////////////

const Log = require(`./project_modules/Logger/index.js`);
const SmartServer = require(`./project_modules/SmartServer/index.js`);

////////////////////////////////

Log.Info("Loading Node.JS modules...")

const fs = require(`fs`);
const fetch = require(`node-fetch`);

Log.Success("Successfully loading Node.JS modules.")

////////////////////////////////

Log.Info("Starting Express Web-Server...")

const { express, app, addPage, addGetAPI, finalInitializing } = new SmartServer(33010);

Log.Success("Express Web-Server successfully started.")

////////////////////////////////

Log.Info("Init sockets for MTA sockets...")

Log.Success("MTA sockets successfully initialized.")

////////////////////////////////

global.Express = {
	addPage: addPage,
	addGetAPI: addGetAPI
}

////////////////////////////////

global.EJSMethods = {};
global.Globals = {};

////////////////////////////////

fs.readdirSync(`./.includes/`).forEach(
	function (file) {
		try {
			Log.Info(`Loading include "${file}"...`);

			require(`./.includes/${file}`);

			Log.Success(`Successfully loading include.`);
		} catch(e) {
			Log.Error(`Include can't be loaded.`, e.toString());
		};
	}
);

////////////////////////////////

// process.__defineGetter__('stderr', function(a) { 
// 	return fs.createWriteStream(__dirname + '/error.log', {flags:'a'}) 
// })

////////////////////////////////

finalInitializing();

Log.Success("Project starting fully completed!")