/** 网络请求的js */
const request = require("request");

let net = {
    version: 1,
    netComm(method = "get", url = "", data = {}, cb, opt) { // 通用的网络请求方法
        let defaultOpt = {
            url,
            method: method.toUpperCase(),
            qs: "",
            body: "",
            json: true
        };
        let para = Object.assign(defaultOpt, opt);
        para.method == "GET" ? (para.qs = data) : (para.body = data);
        // cb(err, data, response)
        request(para, cb);
    },
    get(url, data, cb, opt) {
        this.netComm("get", url, data, cb, opt)
    },
    post(url, data, cb, opt) {
        this.netComm("post", url, data, cb, opt)
    }
}

export default net;