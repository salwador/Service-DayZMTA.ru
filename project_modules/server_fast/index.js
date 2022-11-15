Log.Info(`Loading module "server_fast"...`);

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
            [``, `index`, `index.html`, `index.php`, `index.htm`].forEach(
                async function (dir) {
                    app.get(`${adress}${dir}`, callback);
                }
            );
        };

        this.addGetAPI = function (adress, callback) {
            [``, `.php`, `.html`, `.htm`].forEach(
                async function (dir) {
                    app.get(`${adress}${dir}`, callback);
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

Log.Success(`Successfully loading module "server_fast".`);