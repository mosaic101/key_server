const redis = require('redis');
const NoRepeat = require('norepeat');
const config = require('getconfig');
const redisConfig = config.redis;
const client = redis.createClient({
    host: redisConfig.host,
    port: redisConfig.port,
    db: redisConfig.db
});
const noRepeat = new NoRepeat(client);
const DEFAULT_REPEAT_MESSAGE = '访问频率过高！请稍后再试！';

module.exports.isRepeat = noRepeat.isRepeat;
/**
 * 防重中间件
 * @param name 如果是方法将使用返回值作为防重的key，方法的参数为req
 *             如果是字符串{}中的内容将被替换为req重的参数比如：a{query.id}b{query.name}c 将被转换为 a+req.query.id+b+req.query.name+c
 *             建议为业务:单据Id:用户ID
 * @param ttl 时间间隔，秒
 * @param message 返回错误，如果没有将默认返回
 * @returns {Function}
 */
module.exports.notRepeat = function ({name, ttl, message}) {
    let templates = [];
    message = message || DEFAULT_REPEAT_MESSAGE;
    if (typeof name === 'function') {
        templates.push(name);
    } else {
        let templateStr = name;
        let template = null;
        /**
         * 获取根据body.id获取req.body.id内容
         * @param template name模板
         * @returns {Function}
         */
        let spiltRequest = (template) => {
            let spilts = template.split('.');
            let getAttr = function (obj, keys) {
                if (keys.length) {
                    return obj[keys[0]] && getAttr(obj[keys[0]], keys.slice(1, keys.length)) || '';
                } else {
                    return obj;
                }
            }
            return function (req) {
                return getAttr(req, spilts);
            }
        }
        let str = '';
        for (let char of templateStr) {
            switch (char) {
                case '{':
                    templates.push(str);
                    str = '';
                    template = '';
                    break;
                case '}':
                    templates.push(spiltRequest(template));
                    template = null;
                    break;
                default:
                    if (template !== null) {
                        template += char;
                    } else {
                        str += char;
                    }
            }
        }
        templates.push(str);
    }
    return function (req, res, next) {
        Promise.resolve()
            .then(() => {
                let name = '';
                for (let template of templates) {
                    if (typeof template === 'string') {
                        name += template;
                    } else if (typeof template === 'function') {
                        name += template(req);
                    }
                }
                noRepeat.isRepeat({
                    name: name,
                    ttl: ttl
                }, function (error, isRepeat) {
                    if (error) {
                        return res.error(error);
                    }
                    if (isRepeat) {
                        return next();
                    } else {
                        return res.error({message: message});
                    }
                })
            })
            .catch((error) => {
                res.error(error);
            })
    }
}