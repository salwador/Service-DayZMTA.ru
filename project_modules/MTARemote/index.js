
const Log = require(`./../Logger/index.js`);

////////////////////////////////

Log.Info(`Loading module "MTARemote"...`);

//////////////////

const MTASDK = require(`mtasa-sdk`);

//////////////////

MTASDK.prototype.callAsync = function(resName, functionName, functionArguments) {
    let server = this;

    return new Promise(
        function(resolve, reject) {
            server.call(resName, functionName, functionArguments, 
                function(err, result) {
                    if (err) {
                        resolve(false);
                        return;
                    };

                    resolve(result);
                }
            )
        }
    );
};

const callRemoteFunction = async function(server, methodName, methodArguments = []) {
    let value = await server.callAsync(`runcode`, methodName, methodArguments);

    if (!value) {
        return false;
    };

    try {
        value = JSON.parse(value);
        value = JSON.parse(value);
        value = value[0];    
        return value;
    } catch(e) {
        return false;
    };
};

module.exports = callRemoteFunction;