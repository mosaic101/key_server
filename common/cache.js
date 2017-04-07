/**
 * Created by wujj on 2017/1/13.
 */
const redis = require('redis');
const config = require('getconfig');
const Logger = require('../utils/logger').Logger('cache');
const client = redis.createClient(config.redis.port, config.redis.host);

/**
 * 将键值对存入缓存
 * @param key 键值
 * @param value value值
 * @param expire 失效时间，单位秒
 * @returns {Promise.<*>} 设置一个字符串类型的值，返回值：true
 */
exports.setValue = (key,value,expire) => {
    return new Promise((resolve,reject) => {
        if(!key || !value) {
            return reject(new Error('参数错误'));
        }
        return client.set(key, value, function (error) {
            if (error) {
                Logger.error(error);
                return reject(error);
            }
            // 设置失效时间
            if (expire && expire > 0) {
                client.expire(key, expire);
            }
            return resolve(true);
        });
    });
};

/**
 * 根据KEY值获取缓存中的键值对
 * @param key 缓存KEY
 * @returns {Promise.<*>}
 */
exports.getValue = key => {
    return new Promise((resolve,reject) => {
        if(!key) {
            return reject(new Error('参数错误'));
        }
        return client.get(key, function (error, result) {
            if (error) {
                Logger.error(error);
                return reject(error);
            }
            return resolve(result);
        });
    });
};

/**
 * 设置缓存失效时间
 * @param key 键值
 * @param expire 失效时间，单位秒
 * @returns {Promise.<*>}
 */
exports.setExpire = (key,expire) => {
    if (!key || !expire) {
        return Promise.reject(new Error('参数错误'));
    }
    try {
        return client.expire(key, expire);
    } catch (error) {
        Logger.error(error);
        return Promise.reject(new Error('设置缓存失效时间失败'));
    }
};

/**
 * 将键值对存入内存
 * @param options
 *    options.firKey 键值1
 *    options.secKey 键值2
 *    options.value value值
 *    options.expire 失效时间，单位秒
 * @returns {Promise.<*>} 设置一个字符串类型的值，返回值：true
 */
exports.hmSetValue = options => {
    if (!options || !options.firKey || !options.value) {
        return Promise.reject(new Error('参数错误'));
    }
    if (options.secKey) {
        client.hmset(options.firKey, options.secKey, options.value, function (error) {
            if (error) {
                Logger.error(error);
                return Promise.reject(new Error('键值对保存失败'));
            }
            // 设置失效时间
            if (options.expire > 0) {
                client.expire(options.key, options.expire);
            }
            return Promise.resolve(true);
        });
    } else {
        client.hmset(options.firKey, options.value, function (error) {
            if (error) {
                Logger.error(error);
                return Promise.reject(new Error('键值对保存失败'));
            }
            // 设置失效时间
            if (options.expire > 0) {
                client.expire(options.key, options.expire);
            }
            return Promise.resolve(true);
        });
    }

};

/**
 * 获取缓存中的键值对
 * @param options.firKey 键值
 * @param options.secKey 键值
 * @returns {Promise.<*>} 获取一个字符串类型的值
 */
exports.hmGetValue = options => {
    if (!options || !options.firKey) {
        return Promise.reject(new Error('参数错误'));
    }
    if (options.secKey) {
        client.hmget(options.firKey, options.secKey, function (error, result) {
            if (error) {
                Logger.error(error);
                return Promise.reject(new Error('键值对保存失败'));
            }
            return Promise.resolve(result && result[0] && result);
        });
    } else {
        client.hgetall(options.firKey, function (error, result) {
            if (error) {
                Logger.error(error);
                return Promise.reject(new Error('键值对保存失败'));
            }
            return Promise.resolve(result);
        });
    }
};

/**
 * 根据KEY值删除缓存中的键值对
 * @param key 键值
 * @returns {Promise.<*>} 删除的缓存数目
 */
exports.delValue = function (key) {
    if (!key) {
        return Promise.reject(new Error('参数错误'));
    }
    client.del(key, function (error, result) {
        if (error) {
            Logger.error(error);
            return Promise.reject(new Error('获取失败'));
        }
        return Promise.resolve(result);
    });
};

// redis 链接错误
client.on('error', function (error) {
    Logger.error(error);
});