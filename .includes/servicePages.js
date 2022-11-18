const Log = require(`../project_modules/Logger/index.js`)

////////////////////////////////

Express.addPage(`/`,
    async function (req, res) {
        let clientIP = req.headers[`cf-connecting-ip`] || req.headers[`x-real-ip`] || req.socket.remoteAddress.split(`:`)[3];
        Log.Warn(`"${clientIP}" is tried open index page.`);

        res.render(`./index.ejs`, {
            EJSMethods: EJSMethods,
            Globals: Globals
        });
    }
);