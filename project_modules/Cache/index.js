const Log = require(`./../Logger/index.js`)

////////////////////////////////

Log.Info(`Loading module "Cache"...`);

////////////////////////////////

const cacheInfo = new Map();

const getCacheInfo = async function (name, callback, time = 60000, isScheduler) {
	if (cacheInfo.has(name) && (!isScheduler)) {
		return cacheInfo.get(name);
	};

	if (callback && time) {
		const result = await callback();
		cacheInfo.set(name, result);

		if (!isScheduler) {
			setTimeout(
				function () {
					cacheInfo.delete(name);
				}, time
			);
		};

		return result;
	};

	return false;
};

const getCacheSyncInfo = function (name, callback, time = 60000, isScheduler) {
	if (cacheInfo.has(name) && (!isScheduler)) {
		return cacheInfo.get(name);
	};

	if (callback && time) {
		const result = callback();
		cacheInfo.set(name, result);

		if (!isScheduler) {
			setTimeout(
				function () {
					cacheInfo.delete(name);
				}, time
			);
		};

		return result;
	};

	return false;
};

const scheduleCacheInfo = function (name, callback, updatetime = 60000, defaultValue) {
	const schedulerCallFunction = function () {
		getCacheInfo(name, callback, updatetime, true);
	};

	if (!cacheInfo.has(name)) {
		cacheInfo.set(name, defaultValue);
	};

	setInterval(schedulerCallFunction, updatetime);
	schedulerCallFunction();
};

module.exports = {
	get: getCacheInfo,
	getSync: getCacheSyncInfo,
	schedule: scheduleCacheInfo,
};

////////////////////////////////

Log.Success(`Successfully loading module "Cache".`);