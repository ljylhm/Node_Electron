/**
 * @description 获取page页下的路由集合
 */

/**
  * @description 合并集合已有，相同的路由
*/
let merge = {
    baseMerge: function (o1, o2) {
        if (typeof (o2) != "object") return;
        for (var i in o2) {
            if (typeof (o2[i]) == "object") {
                o1[i] = o1[i] || {};
                o1[i] = this.baseMerge(o1[i], o2[i])
            } else {
                o1[i] = o1[i] || "";
                o1[i] = o2[i];
            }
        }
        return o1;
    },

    /**
    * @description 合并多个参数
    * @param {Object} obj1
    * @param {Object} obj2
    * @returns {Object} 第一个对象被改变
    */

    merge: function () {
        let arg = Array.from(arguments),
            _baseData = arg[0];
        if (arg.length < 2) return arg;
        for (let i = 1, l = arg.length; i < l; i++) {
            _baseData = this.baseMerge(_baseData, arg[i]);
        }
        return _baseData;
    },
}

/**
  * @description 处理子路由的函数
  * @param {String} 文件夹的名字
  * @ruler 规则 在文件名字中带有 '-' 号即为一层路由 命名中有多个'-' 就有几层路由
*/

let handleChild = (path, name) => {
    let _routes = new Object(), // 路由对象
        _level_arrs = name.split("-");

    let routeObj = {
        path: "", name: "", component: ""
    }

    _level_arrs.forEach((ele, index, arr) => {

    });
}

/**
  * @description 获得一个文件夹下的所有指定格式文件的名字
  * @param {Object} 文件夹的文件对象名字
  * @return {Array} vue-router格式的路由集合
*/

let importAll = (r) => {
    let _routes = [];
    r.keys().map(function (t) {
        let k = t.replace(/\.vue$/, ''), index = k.indexOf('./'), j = k.substring(index + 1), name = j.substring(1);
        _routes.push({
            path: j,
            name: name,
            component: require("../page" + j + '.vue'),
        })
    });
    return _routes
}

/**
* @description 设置路由的主函数
*/
let setRoutes = () => {
    let _list = require.context('../page/', false, /\.vue$/);
    importAll(_list);
}

let main = (o1, o2, o3) => {
    console.log(merge.merge(o1, o2, o3));
}

export default main;