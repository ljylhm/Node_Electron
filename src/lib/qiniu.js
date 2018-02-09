const qiniu = require("qiniu");
const { URL } = require("url");
const qs = require("querystring");
import net from "./net";


let urlist = {
    bucket_domain: "https://api.qiniu.com/v6/domain/list"
}

let Qhelper = {
    mac: { // 用户的Ak&SK
        accessKey: "kmfsyyVNEuUPI-1C6ImRhEw8MxYYWJoIMyjTK9W5",
        secretKey: "li7XydI7IZH19W1_4inYa32qikWtY2sekhDwOJ50"
    },
    setMac(ak, sk) {
        this.mac.accessKey = ak;
        this.mac.secretKey = sk;
    },
    getTransformUrl(path, data) {
        let newUrl = new URL(path);
        newUrl.search = qs.stringify(data);
        return newUrl.href;
    },
    defaultHeaders(accessToken, ct = "application/json") {
        return {
            headers: {
                "Authorization": accessToken,
                "Content-Type": ct
            }
        }
    },
    // body只有在content-type为application/x-www-form-urlencoded的时候才会使用
    createAccessToken(url, body) {
        return qiniu.util.generateAccessToken(this.mac, url, body)
    },
    // 获取信息通用的接口
    getInfo(url, data, cb, body) {
        url = this.getTransformUrl(url, data);
        let accessToken = this.createAccessToken(url, body),
            opt = this.defaultHeaders(accessToken);
        net.get(url, data, cb, opt);
    },
    // // 获得bucket下的域名集合
    // getBucketDomain(url, data, cb, body) {
    //     let accessToken = this.createAccessToken(url, body),
    //         opt = this.defaultHeaders(accessToken);
    //     net.get(url, data, cb, opt);
    // },
    // // 获得bucket和你整个统计空间中当前的存储量
    // getCount(url, data, cb, body) {
    //     let accessToken = this.createAccessToken(url, body),
    //         opt = this.defaultHeaders(accessToken);
    //     net.get(url, data, cb, opt);
    // },
}

let x = "https://api.qiniu.com/v6/space?bucket=liang-img&begin=20180501000000&end=20180530000000&g=day",
    z = "https://rsf.qbox.me/list?bucket=liang-img&limit=1000",
    t = "https://api.qiniu.com/v6/blob_transfer",
    y = "https://api.qiniu.com/v6/domain/list";

// Qhelper.getInfoList(z, {
//     bucket: "liang-img",
//     limit: 1000
// }, function (err, res, data) {
//     console.log(data);
// })
export default Qhelper;