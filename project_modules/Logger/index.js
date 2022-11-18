console.log(`Loading module "Logger"...`);

////////////////////////////////

const infoLogger = require('node-color-log');  

////////////////////////////////

const colored = true;

////////////////////////////////

const outputInfoMessage = function(...options) {
    if (!colored) {
        console.log(`INFO:`, ...options);
        return;
    };

    infoLogger.color(`black`).bgColor(`cyan`).log(`INFO:`).joint().color(`cyan`).log(``, ...options);
};

const outputSuccessMessage = function(...options) {
    if (!colored) {
        console.log(`SUCCESS:`, ...options);
        return;
    };

    infoLogger.color(`black`).bgColor(`green`).log(`SUCCESS:`).joint().color(`green`).log(``, ...options);
};

const outputWarnMessage = function(...options) {
    if (!colored) {
        console.log(`WARN:`, ...options);
        return;
    };

    infoLogger.color(`black`).bgColor(`yellow`).log(`WARN:`).joint().color(`yellow`).log(``, ...options);
};

const outputErrorMessage = function(...options) {
    if (!colored) {
        console.log(`ERROR:`, ...options);
        return;
    };

    infoLogger.color(`white`).bgColor(`red`).log(`ERROR:`).joint().color(`red`).log(``, ...options);
};

////////////////////////////////

outputInfoMessage.Success = outputSuccessMessage;
outputInfoMessage.Error = outputErrorMessage;
outputInfoMessage.Warn = outputWarnMessage;
outputInfoMessage.Info = outputInfoMessage;

////////////////////////////////

module.exports = outputInfoMessage;

////////////////////////////////

outputInfoMessage.Success(`Successfully loading module "Logger".`)