Express.addPage(`/`,
    async function (req, res) {
        res.render(`./index.ejs`, {
            EJSMethods: EJSMethods,
            Globals: Globals
        });
    }
);