/**
 * Created by wujj on 2017/2/17.
 */
const redis = require('redis');
const NoRepeat = require('norepeat');
const Promise = require('bluebird');
const config = require('getconfig');
const redisConfig = config.redis;

const client = redis.createClient({
    host: redisConfig.host,
    port: redisConfig.port,
    db: redisConfig.db
});
const noRepeat = new NoRepeat(client);
const DEFAULT_REPEAT_MESSAGE = '请求频率过快，请稍后再试！';

/**
 *
 * @param {Object} name 业务 + 用户id + 请求参数
 * @param {Number} ttl 时间间隔，秒
 * @param {String} message
 */
exports.check = ({name, ttl, message}) => {
    message = message || DEFAULT_REPEAT_MESSAGE;
    return (req,res,next) => {
        let newName = '';
        let templates = name.split(':');
        //获取请求中对应的值
        let getTemplateInfo = (name,req) => {
            console.info(req[name]);
            return req[name];
        };
        for (let template of templates) {
            if (typeof template === 'string') {
                newName += template;
            }else if (typeof template === 'function') {
                newName += getTemplateInfo(template,req);
            }
        }
        console.info(newName);
        return Promise.resolve().then(() => {
            return noRepeat.isRepeat({
                name: name,
                ttl: ttl || 5
            },function (error,isRepeat) {
                if (error) {
                    return res.error(error);
                }
                if (isRepeat) {
                    return next();
                } else {
                    return res.error(message);
                }
            })
        }).catch(err => {
            return res.error(err);
        })
    }
};


exports.isRepeat = noRepeat.isRepeat;