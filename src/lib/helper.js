const fs = require('fs');
const path = require('path');
import { electron } from "electron";
import { showInfo } from "@showInfo";
import net from "./net";
let _router;

(function (D) {
    D.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    }
})(Date)

let helper = {
    /*
   * @初始化路由
   */
    init: function (router) {
        _router = router
    },
    oneDayTime: 1000 * 60 * 60 * 24,
    currentTime: "",
    saveJsonPath:path.resolve(__dirname,"../../history/downloadhs.json"),
    /*
    * @路由跳转 默认通过path来查找 参数通过param的方式来传递
    * query会将参数带在链接里 param则不会
    * @url 链接
    * @args 携带的参数
    * @mode 正常模式 或 replace模式
    */
    routerJump: function (url, args, mode) {
        if (!_router || !url) return;

        args = args || "";
        mode = mode || true;
        let para = { name: url, params: args };

        if (mode) _router.push(para);
        else _router.replace(para);
    },
    routerReplace: function (url, args) {
        this.routerJump(url, args, false);
    },
    routerGo: function (num) {
        if (!_router) return;
        _router.go(num);
    },
    routerDataGet: function () {
        return _router.currentRoute.params || {};
    },
    downLoadUrl(url, filename) { // 下载链接
        var eleLink = document.createElement('a');
        eleLink.href = url;
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    },
    getTime(cb) { // 获取时间
        net.get("http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp", {}, cb)
    },
    byteToMb(byte) {
        return (byte / (1024 * 1024)).toFixed(2);
    },
    byteToKb(byte) {
        return (byte / 1024).toFixed(2);
    },

    argmentsCheck() {
        let flag = Array.from(arguments).length <= 0 ? false : true;
        return flag;
    },

    getDataType(obj) {
        let _type = "", _type_str = "";

        _type = Object.prototype.toString.call(obj);
        _type_str = _type.substring(8, _type.length - 1);

        return _type_str;
    },

    isEmptyObject(obj) {
        if (this.getDataType(obj) == "Arguments") {
            if (obj.length <= 0) return true;
            else return false
        }
        for (var key in obj) {
            return false;
        }
        return true;
    },

    /**
    * @description 对sessionStorage进行设置
    * @param {String} name
    * @param {String} value
    */

    sessionSet: function (name, value) {
        if (!this.argmentsCheck(arguments)) return;
        sessionStorage.setItem(name, value);
    },

    /**
     * @description 得到sessionStorage的值
     * @param {String} name
     * @returns {String}
     */

    sessionGet: function (name) {
        if (!this.argmentsCheck(name)) return Window.sessionStorage;
        return sessionStorage.getItem(name);
    },

    /**
    * @description 清除sessionStorage
    * @param {String} name
    */

    sessionClear: function (name) {
        var sessionJson = Window.sessionStorage;
        if (!this.argmentsCheck(arguments) && !this.isEmptyObject(sessionJson)) {
            sessionJson.clear();
        }
        sessionJson.removeItem(name);
    },

    /**
     * @description 对localStorage进行设置
     * @param {String} name
     * @param {String} value
     * @returns
     */

    localStorageSet: function (name, value) {
        if (!this.argmentsCheck(arguments)) return;
        localStorage.setItem(name, value);
    },

    /**
     * @description 获得localStorageGet的值
     * @param {String} name
     * @param {String} value
     * @returns
     */

    localStorageGet: function (name) {
        if (!this.argmentsCheck(arguments)) return Window.localStorage;
        return localStorage.getItem(name);
    },

    /**
     * @description 清除localStorage
     * @param {String} name
     */

    localStorageClear: function (name) {
        if (!this.argmentsCheck(arguments) && !this.isEmptyObject(window.localStorage)) {
            window.localStorage.clear();
        }
        console.log(window.localStorage);
        console.log("name", name);
        window.localStorage.removeItem(name);
    },

    transformDate(data, days = 0){
        return new Date((new Date(data).getTime() - this.oneDayTime * days)).format("yyyy-MM-dd")
    },

    // 对象排序
    objectSort(obj,flag=true){
        
        let _t = Object.keys(obj);
        
        _t.sort((a,b)=>{
            if(flag) return Date.parse(a) - Date.parse(b);
            return Date.parse(b) - Date.parse(a); 
        });

        let newO = new Object();  

        for(let i of _t){
            newO[i] = obj[i];
        }
        return newO;
    }

}

helper.getTime((err, res, data) => {
    helper.currentTime = data.data.t;
})

let checking = {
    /**
    * @description 通过路径来判断是否是文件
    */
    isExist: function (paths) {
        return fs.existsSync(paths);
    },
    isFile: function (paths) {
        return this.isExist(paths) && fs.statSync(paths).isFile();
    },
    isDir: function (paths) {
        return this.isExist(paths) && fs.statSync(paths).isDirectory();
    }
}

let getFileInfo = {
    getExtName: (p) => path.extname(p),
    getBase64: (p, cb) => {
        readInfo.getFileInfo(p, function (files) {
            // 到这里的话就表示成功了
            files = files.toString("base64");
            cb && cb(files);
        })
    }
}

let readInfo = {
    /**
     * @description 获取文件夹下的文件信息
     * @param {String} path
     * @param {Function} cb 回调函数
     */
    getDirInfo(path, cb) {
        fs.readdir(path, function (err, files) {
            if (err) {
                showInfo.message("读取文件的时候发生了一点问题", "error");
            } else {
                let arr = new Array();
                for (let i of files) {
                    console.log(i);
                }
            }
        })
    },
    /**
    * @description 获取某个文件的信息
    * @param {String} path
    * @param {Function} cb 回调函数
    */
    getFileInfo(p, cb) {
        fs.readFile(p, function (err, files) {
            if (err) showInfo.message("读取文件的时候发生了一点问题", "error");
            else cb && cb(files);
        })
    }
}

let writeInfo = {
    /**
    * @description 写入信息到指定的文件中
    * @param {String} path
    * @param {Function} cb 回调函数
    */
    writeInfo: function (data, path,cb) {
        fs.writeFile(path, data, function (err) {
            if (err) throw err;
            else cb && cb();
        })
    }
}

export {
    helper,
    checking,
    getFileInfo,
    readInfo,
    writeInfo
}