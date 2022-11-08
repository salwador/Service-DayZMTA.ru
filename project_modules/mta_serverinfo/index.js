
const iconv = require(`iconv-lite`);
const dgram = require(`dgram`);

// const { performance } = require('perf_hooks');
const { Buffer } = require(`buffer`);
// const { escape, unescape } = require('querystring');

////////////////////////////////

const socketRequestTag = Buffer.from(`s`);
const socketClients = [];
let socketClient = 0;

////////////////////////////////

let createSocketClients = function(value = 1) {
    for (let i = 0; i < value; i++) {
        socketClients[i] = dgram.createSocket('udp4');
    };

    return true;
};

let getSocketClient = function() {
	socketClient = socketClient + 1;

	if (socketClient >= socketClients.length) {
		socketClient = 0;
	};

	return socketClients[socketClient];
};

// let chr = function (n) {
//     if (n < 128) {
//         return String.fromCharCode(n);
//     } else {
//         return "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "[n - 128];
//     };
// };

let ord = function ( str ) {
	let ch = str.charCodeAt(0);

	if (ch > 0xFF) {
		ch -= 0x350;
	};

	return ch;
};

let requestInfo = function(ip, port) {
	return new Promise(
		function(resolve, reject) {
			let client = getSocketClient();

			client.connect(port + 123, ip, (err) => {
				console.log(`connected`);

				let timeoutInterval = setTimeout(
					function() {
						try {
							client.disconnect();
						} catch(e) {							
						};
						
						timeoutInterval = false;
						resolve(false);
					}, 15 * 1000
				);
			
				client.send(Buffer.from(`s`), (err) => {	
					client.on('message', function (receiveData) {
						try {
							client.disconnect();
						} catch(e) {							
						};
						
						if (timeoutInterval === false) {
							resolve(false);
							return;
						};

						let index = 0;					
						let tag = receiveData.subarray(index, index += 4).toString('utf-8');
						
						if (tag != `EYE1`) {
							return false;
						};
						
						let dataLength, data; 
						let info = [];
			
						for (let i = 0; i < 9; i++) {				
							dataLength = ord(receiveData.subarray(index, index += 1).toString('utf-8'));
							data = receiveData.subarray(index, (index += (dataLength - 1))).toString('utf-8');		
							info[i] = data;
						};

						clearTimeout(timeoutInterval);
						timeoutInterval = false;

						let returnTable = {
							name: info[2],
							gamemode: info[3],
							map: info[4],
							version: info[5],
							private: info[6] == `1`,
							players: info[7],
							max_players: info[8]
						};

						if (info[0] != `mta`) {
							resolve(false);
							return;
						};

						resolve(returnTable);			
					});
				});
			});
			
			client.on('error', function() {
				try {
					client.disconnect();
				} catch(e) {							
				};
						
				if (timeoutInterval === false) {
					resolve(false);
					return;
				};
						
				clearTimeout(timeoutInterval);
				timeoutInterval = false;
				resolve(false);
			});
		}
	);
};

module.exports = {
	getStatus: requestInfo,
	createSocket: createSocketClients,
};