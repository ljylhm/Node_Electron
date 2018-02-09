/** 压缩图片的关键代码在这里*/
const path = require("path");
const fs = require("fs");
import { showInfo } from "./showInfo";
let tinify = require("tinify");

let testPath = "D:/MyConfiguration/ljy48594/Desktop/毕业照片/606088990210971110.jpg";
let testPath1 = "D:/MyConfiguration/ljy48594/Desktop/毕业照片/test4.jpg";

let MY_KEY = "JfyieVfXFrhJ8G5ekPLkx0BnCxfKu5Q9";

tinify.key = MY_KEY;

let setKey = (key) => {
    tinify.key = key;
}
// 处理路径和文件名的问题
let handlePath = function (sn, tn = "", suffix) {
    let dirname = path.dirname(sn),
        extname = path.extname(sn),
        realname = path.basename(sn, extname); // 获得文件真实的名字
    let getname = (tn + "/" + realname + suffix + extname).replace(/\\/g, "/");
    return {
        getname: getname,
        realname: realname + suffix + extname
    };
}

let validate = new Promise(function (resolve, reject) {
    tinify.validate(function (err, data) {
        if (err) reject(err);
        else {
            resolve(tinify.compressionCount);
        }
    })
})

let writeInfo = function (path, data, cb) {
    fs.writeFile(path, data, function (err) {
        cb && cb(err, data);
    })
}

/**
 * @description 压缩的主方法
 * @param {String} pathArr 路径的集合
 * @param {String} toPath 要解压到的路径
 */
let compressImage = function (source, target, handleObj, cb, gzipData, opt = {}) {

    let fn = new Promise((resolve, reject) => {

        fs.readFile(source.path, function (err, sourceData) {
            if (err) reject(err);
            else {
                let loadingInstance = showInfo.showLoading("正在加载", true, {
                    lock: true,
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                tinify.fromBuffer(sourceData).toBuffer(function (err, resultData) {
                    if (err) reject(err);
                    else {
                        writeInfo(target, resultData, function (err, data) {
                            // 写入成功的回调
                            showInfo.loadingClose(loadingInstance);
                            ++handleObj.gzipOrder.gzipIndex;
                            if (err) reject(err);
                            else resolve(handleObj);
                        });
                    }
                });
            }
        })
    })

    let t = function (o) {
        gzipData.push(o);
        if (o.gzipOrder.gzipIndex >= o.gzipOrder.gzipLen) {
            cb && cb(gzipData);
        }
    }

    fn.then((data) => {
        // 成功处理 获取压缩图片的信息
        handleObj.gzipSize = fs.statSync(handleObj.gzipPath).size;
        handleObj.gzipRatio = (((handleObj.size - handleObj.gzipSize) / handleObj.size) * 100).toFixed(1) + "%";
        t(handleObj);
    }, (err) => {
        // 失败处理  
        handleObj.errInfo = err;
        console.log("failed");
        t(handleObj);
    })
}

// cb 成功回调的函数
let compressAll = function (compressData = [], gzipData = [], opt = {}, cb) {

    let handleCommObj = {
        gzipSize: "", // 压缩后的体积 +
        gzipPath: "", // 压缩后的路径 +
        gzipRatio: "", // 压缩率 +
        gzipName: "", // 压缩后文件的名字 + 
        errInfo: "", // 错误信息 有错误消息的话 默认发生错误
        gzipOrder: {
            gzipIndex: 0, // 压缩的顺序
            gzipLen: compressData.length // 压缩数组的长度 
        }
    }

    compressData.forEach((ele, index, arr) => {
        let tPath = handlePath(ele.path, opt.toPath, opt.extname),
            handleObj = Object.assign({}, handleCommObj, ele);
        handleObj.gzipPath = tPath.getname; // 压缩的路径
        handleObj.gzipName = tPath.realname; // 压缩的名字
        compressImage(ele, tPath.getname, handleObj, cb, gzipData);
    })
}

export {
    validate,
    compressAll,
    setKey
}



