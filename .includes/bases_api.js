const fetch = require(`node-fetch`);

////////////////////////////////

Express.addGetAPI(`/api/bases/getBasesInfo`, async function (req, res) {
    let baseStatusInfo = await CacheInfo.get(`requestBasesStatus`, async function () {
        let result = await fetch(`https://script.google.com/macros/s/AKfycbwRSOzZREuTvL5358lEZW2nbGqHJ59B9RABvpBAaOyXx7Zpocw/exec`);

        let baseStatusJSON = await result.json();

        if (typeof (baseStatusJSON) != `object`) {
            return {
                error: `error request bases status`
            };
        };

        return baseStatusJSON;
    }, 60000 * 3);

    res.send(baseStatusInfo);
});

Express.addGetAPI(`/api/bases/getBaseInfo`, async function (req, res) {
    let base = req.query.base;

    if (!base) {
        return res.send({
            error: `"base" parameters not exists`
        });
    };

    let baseStatusInfo = await CacheInfo.get(`requestBaseStatus_${base}`, async function () {
        let result = await fetch(`https://script.google.com/macros/s/AKfycbw6sXPTbwHA1h2RpP3jwNObokU67nAXsKKgXSc3WEjjimJ530i1/exec?baseName=${base}`);

        let baseStatusJSON = await result.json();

        if (typeof (baseStatusJSON) != `object`) {
            return {
                error: `error request bases status`
            };
        };

        return baseStatusJSON;
    }, 60000 * 3);

    res.send(baseStatusInfo);
});