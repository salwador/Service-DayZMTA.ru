let serversInfo = require(`../project_configs/serversList.js`);

//////////////////
    
const serversByID = new Map();
const serversByName = new Map();
const serversList = [];

//////////////////

const getServersList = function() {
    return serversInfo;
};

const isServerNameExists = function (name) {
    return serversByName.has(name);
};

const isServerIDExists = function (name) {
    return serversByName.has(name);
};

const getServerByName = function (name) {
    return serversByName.get(name);
};

const getServerByID = function (name) {
    return serversByName.get(name);
};

const initServersInfo = function () {    
    serversInfo.forEach(
        function (serverInfo) {
            serversByID.set(serverInfo.id, serverInfo);
            serversByName.set(serverInfo.name, serverInfo);
        }
    );
};

//////////////////

initServersInfo();

//////////////////

module.exports = {
    existsByName: isServerNameExists,
    existsByID: isServerIDExists,
    getAll: getServersList,
    getByName: getServerByName,
    getServerByID: getServerByID
};