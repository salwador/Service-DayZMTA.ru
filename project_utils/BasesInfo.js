let basesInfo = require(`../project_configs/basesList`);

//////////////////
    
const basesByID = new Map();
const basesByName = new Map();
const basesList = [];

//////////////////

const getBasesList = function() {
    return basesInfo;
};

const isBaseNameExists = function (name) {
    return basesByName.has(name);
};

const isBaseIDExists = function (name) {
    return basesByName.has(name);
};

const getBaseByName = function (name) {
    return basesByName.get(name);
};

const getBaseByID = function (name) {
    return basesByName.get(name);
};

const initBasesInfo = function () {    
    basesInfo.forEach(
        function (baseInfo) {
            basesByID.set(baseInfo.id, baseInfo);
            basesByName.set(baseInfo.name, baseInfo);
        }
    );
};

//////////////////

initBasesInfo();

//////////////////

module.exports = {
    existsByName: isBaseNameExists,
    existsByID: isBaseIDExists,
    getAll: getBasesList,
    getByName: getBaseByName,
    getBaseByID: getBaseByID
};