/** 这个js主要是封装了element ui中用来展示消息的一些组件 */
import { Message, MessageBox, Loading, Notification } from 'element-ui';

let showInfo = {
    /**
     * @description 针对elementUi message的封装
     * @param {String} mes 展示的文字信息
     * @param {String} type 类型 error warning success 可不填
     * @param {Boolean} isC 是否居中
     * @param {Object/Json} opt 其他设置
     */

    message: function (mes, type, isC, opt = {}) {
        let o = {
            message: mes || "",
            type: type || "",
            center: isC || true
        }
        o = Object.assign(o, opt);
        return Message(o);
    },

    /**
     * @description 关闭Message实例的方法
     */
    messageClose: function () {
        Message.closeAll()
    },

    /**
     * @description 针对elementUi confirm的封装
     * @param {String} mes 展示的文字信息
     * @param {String} title 标题
     * @param {String} type 类型 error warning success 可不填
     * @param {Object/Json} opt 其他设置
     * type {success / info / warning / error}
     */

    confirmInfo: function (mes, title = "提示", type, cb, opt = {}) {
        let fn = (action) => {
            let i = action == "confirm" ? true : false;
            cb && cb(i);
        }
        opt = Object.assign({
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: type || "info",
            callback: fn
        }, opt);
        console.log("opt", opt);
        MessageBox.confirm(mes, title, opt, type);
    },

    alertInfo: function (mes, title = "提示", type, cb, opt) {
        MessageBox.alert(mes, title, {
            confirmButtonText: '确定',
            type: type || "info",
            callback: cb
        })
    },

    showLoading(text = "正在加载", fullscreen = "true", opt = {}) { // 展示加载的效果
        return Loading.service(Object.assign({
            text: text,
            fullscreen: fullscreen
        }, opt))
    },

    loadingClose(loadingInstance) {
        loadingInstance.close();
    },

    // 弹出通知的方法
    // success/warning/info/error
    showNotifi(title = "", message = "", type = "success", opt) {
        return Notification(Object.assign({
            title: title,
            message: message,
            type: type,
            duration: 3000
        }, opt))
    },

    NotifiClose(NotifiInstance) {
        NotifiInstance.close();
    }
}
export {
    showInfo
}