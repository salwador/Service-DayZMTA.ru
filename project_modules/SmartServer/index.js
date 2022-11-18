const Log = require(`./../Logger/index.js`)

////////////////////////////////

Log.Info(`Loading module "SmartServer"...`);

////////////////////////////////

const launchedServers = {};

////////////////////////////////

class Server {
    constructor(port) {
        const isDev = (new Set(process.argv)).has(`--devmode`);

        // const sass = require('express-compile-sass');
        // const minifyAssets = require('express-minify');

        const express = require(`express`);
        const app = express();

        app.set(`view-engine`, `ejs`);
        app.set(`views`, `./.website`);

        // app.use(
        //     minifyAssets(
        //         {
        //             cache: true
        //         }
        //     )
        // );

        // app.use(
        //     sass(
        //         {
        //             root: `./.assets`,
        //             cache: true,
        //             sourceMap: isDev,
        //             sourceComments: isDev,
        //             watchFiles: true,
        //             logToConsole: false
        //         }
        //     )
        // );


        app.use(express.static(`./.assets`));
        app.use(express.urlencoded({ extended: false }));

        app.listen(port);

        this.express = express;
        this.app = app;

        this.addPage = function (adress, callback) {
            if (typeof(adress) == `object`) {
                for (let i of adress) {
                    this.addPage(i, callback)
                };

                return;
            };

            app.get(`${adress}`, callback);

            [`index`, `index.html`, `index.php`, `index.htm`].forEach(
                async function (dir) {
                    let pathLength = `${adress}${dir}`.length;

                    app.get(`${adress}${dir}`, 
                        function(req, res) {
                            let getQuery = req.originalUrl.substring(pathLength, req.originalUrl.length)
                            res.redirect(307, `${adress}${getQuery}`);
                        }
                    );
                }
            );
        };

        this.addGetAPI = function (adress, callback) {
            if (typeof(adress) == `object`) {
                for (let i of adress) {
                    this.addGetAPI(i, callback)
                };
                
                return;
            };

            app.get(`${adress}`, callback);

            [`.php`, `.html`, `.htm`].forEach(
                async function (dir) {
                    let pathLength = `${adress}${dir}`.length;

                    app.get(`${adress}${dir}`, 
                        function(req, res) {
                            let getQuery = req.originalUrl.substring(pathLength, req.originalUrl.length)
                            res.redirect(307, `${adress}${getQuery}`);
                        }
                    );
                }
            );
        };

        this.finalInitializing = function () {
            app.use(
                function (req, res, next) {
                    res.status(404).render(`./404.ejs`);
                    res.end();
                }
            );
        }
    }
};

module.exports = Server;

////////////////////////////////

Log.Success(`Successfully loading module "SmartServer".`);