const fs = require(`fs`);
const fetch = require(`node-fetch`);

const CacheInfo = require(`./project_modules/cache_info/index.js`);
const ServerFast = require(`./project_modules/server_fast/index.js`);
const MTAInfo = require(`./project_modules/mta_serverinfo/index.js`);

const { express, app, addPage, addGetAPI, finalInitializing } = new ServerFast(33010);

////////////////////////////////

global.Express = {
	addPage: addPage,
	addGetAPI: addGetAPI
}

global.CacheInfo = CacheInfo;
global.MTAInfo = MTAInfo;

////////////////////////////////

global.EJSMethods = {};
global.Globals = {};

////////////////////////////////

MTAInfo.createSocket(16);

////////////////////////////////

require(`./pages.js`);
require(`./bases_api.js`);
require(`./mta_infoapi.js`);
require(`./vk_widget_dayz.js`);
require(`./vk_widget_zero.js`);

////////////////////////////////

// process.__defineGetter__('stderr', function(a) { 
// 	return fs.createWriteStream(__dirname + '/error.log', {flags:'a'}) 
// })

////////////////////////////////

finalInitializing();