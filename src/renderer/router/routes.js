/**
 * @description 获取page页下的路由集合
 */

let chalk = require("chalk");
const fs = require("fs");
const path = require("path");

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

// 处理顶级父对象 直接push进去
let handleTop = (arrRoutes, item) => {
    arrRoutes.push(item)
}

let handleOther = (i, lastRoutes, o) => {
    o["path"] = handleName(o["name"]);
    o["name"] = handleName(o["name"]);
    if (lastRoutes[i]) lastRoutes[i].children.push(o);
}

let handleName = (n) => {
    let s = "";
    n.split("-").forEach((item, index) => {
        if (index > 0) s += item.upperOneLetter();
        else s += item;
    })
    return s;
}

/**
  * @description 处理层级的关系 并最后合成符合vue-router格式的对象
  * @param {allFiles} 遍历page或者任意一个文件下面的所有文件
  * @ruler 规则 
  * 1. 在文件名字中带有 '-' 号即为一层路由 命名中有多个'-' 就有几层路由
  * 2. 处理逻辑是通过递归的方式一层一层的方式去处理 每遍历一次就删掉这层的所有对象 留下的只有此层级以下的层级
  * 3. currentRoutes 是当前的路由对象 lastRoutes是上一级的对象
  * 4. handleName handleOther handleTop 三个工具类函数 用来处理符合格式等问题
*/
let handleLevels = (allFiles) => {

    let arrRoutes = [], // 最后返回的符合vue-router格式的路由对象
        lastRoutes = {}, // 上一级的对象
        currentRoutes = {}; // 当前的层级对象

    let fn = (currentLevel = 1) => {
        if (allFiles.length <= 0) return;
        for (var i = 0; i < allFiles.length; i++) {
            let currentP = allFiles[i].path.split("-");
            if (currentP.length === currentLevel) {
                currentRoutes[allFiles[i].name] = allFiles[i];
                if (currentLevel == 1) handleTop(arrRoutes, allFiles[i]);
                else handleOther(currentP[currentP.length - 2], lastRoutes, allFiles[i]);
                allFiles.splice(i, 1);
                --i
            }
        }
        lastRoutes = currentRoutes;
        currentRoutes = [];
        fn(++currentLevel)
    }
    fn();
    return arrRoutes;
}

/**
  * @description 获得一个文件夹下的所有指定格式文件的名字
  * @param {Object} 文件夹的文件对象名字
  * @return {Array} vue-router格式的路由集合
*/

let importAll = (r) => {
    let _routes = [];
    r.keys().map(function (t) {
        let k = t.replace(/\.vue$/, ''), index = k.indexOf('./'),
            j = k.substring(index + 1),
            name = j.substring(1);
        _routes.push({
            path: j.indexOf('-') >= 0 ? j.substring(1) : j,
            name: name,
            component: require("../page" + j + '.vue').default,
            children: []
        })
    });
    return _routes
}

/**
* @description 设置路由的主函数 require.context是webpack提供给我们的一个遍历文件夹的函数，
* 第一个参数表示要遍历文件夹的路径，第二个参数表示是否要深度遍历，第三个参数可以对文件名进行正则匹配
*/
let setRoutes = () => {
    let _list = require.context('../page/', false, /\.vue$/);
    return importAll(_list);
}

let main = (o1, o2, o3) => {
    console.log(merge.merge(o1, o2, o3));
}

export default handleLevels(setRoutes());