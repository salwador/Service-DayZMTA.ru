console.log(`Loading module "logger_main"...`);

////////////////////////////////

const infoLogger = require('node-color-log');  

////////////////////////////////

infoLogger.setLevel('info');

const outputInfoMessage = function(...options) {
    infoLogger.color(`black`).bgColor(`cyan`).log(`INFO:`).joint().color(`cyan`).log(``, ...options);
};

const outputSuccessMessage = function(...options) {
    infoLogger.color(`black`).bgColor(`green`).log(`SUCCESS:`).joint().color(`green`).log(``, ...options);
};

const outputWarnMessage = function(...options) {
    infoLogger.color(`black`).bgColor(`yellow`).log(`WARN:`).joint().color(`yellow`).log(``, ...options);
};

const outputErrorMessage = function(...options) {
    infoLogger.color(`white`).bgColor(`red`).log(`ERROR:`).joint().color(`red`).log(``, ...options);
};

outputInfoMessage.Success = outputSuccessMessage;
outputInfoMessage.Error = outputErrorMessage;
outputInfoMessage.Warn = outputWarnMessage;
outputInfoMessage.Info = outputInfoMessage;

////////////////////////////////

module.exports = outputInfoMessage;

////////////////////////////////

outputInfoMessage.Success(`Successfully loading module "logger_main".`)