/**
 * fixme 结合redis重构短信服务
 * Created by wujj on 2017/1/16.
 */
let http = require('http');
let querystring = require('querystring');
let Promise = require('bluebird');

/**
 * 发送验证码
 * @param mobile
 * @param callback
 */
let sendMsg = (mobile, callback) => {
    if (!mobile) {
        return callback(new Error('参数错误'));
    }
    let n = 6;
    let code = '';
    for (let i = 0; i < n; i++) {
        code += Math.floor(Math.random() * 10);
    }
    let postData = {
        uid: 'R2fnMH8YRWQi',
        pas: '4k6yuqxq',
        mob: mobile,
        cid: 'aDdOKKe57ppE',
        p1: code,
        type: 'json'
    };
    let content = querystring.stringify(postData);
    let options = {
        host: 'api.weimi.cc',
        path: '/2/sms/send.html',
        method: 'POST',
        agent: false,
        rejectUnauthorized: false,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': content.length
        }
    };
    let req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            chunk = JSON.parse(chunk);
            console.log(chunk);
            if (!chunk || chunk.code != 0) {
                return callback(new Error('接口调用失败'));
            }
            return callback(null,code);

        });
        res.on('end', function () {
            console.log('over');
        });
    });
    req.write(content);
    req.end();
};


/**
 * 生产验证码
 * @param n 位数
 * @returns {string}
 */
// let createCode = function(n) {
//     let code = "";
//     for (let i = 0; i < 6; i++) {
//         code += Math.floor(Math.random() * 10);
//     }
//     return code;
// }
module.exports = {
    sendMsg: sendMsg
};

// function test() {
//     return Promise.promisify(sendMsg)(18362978522);
//
// }
// test().then(function (result) {
//     console.info(111,result);
// }).catch(function (err) {
//     console.error(222,err);
// });

