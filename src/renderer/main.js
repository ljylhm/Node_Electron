import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import { helper, readInfo, writeInfo } from "@helper";
import './components/ref';
import { showInfo } from "@showInfo"
import { ipcRenderer } from "electron";
import routes from "./router/routes";
import 'element-ui/lib/theme-chalk/index.css';
import '../style.css';

import App from './App'
import router from './router'
import store from './store'

// 已进入就跳转到index.vue界面
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI);
helper.saveJsonPathInit();
helper.init(router); // 初始化router对象

ipcRenderer.on("close-window", (event, input, output) => {
  helper.localStorageClear("lastPath");
})

// 开始下载的回调事件
ipcRenderer.on("begin-download", (event, input, output) => {
  showInfo.showNotifi("下载", "添加一个下载事件");
})

// 接收字节的回调事件
ipcRenderer.on("received-bytes", (event, input, output) => {
  // showInfo.showNotifi("下载","接收到的字节数量为"+input);
})

// 下载成功的回调事件
ipcRenderer.on("success-download", (event, input, output) => {
  readInfo.getFileInfo(helper.saveJsonPath, (files) => {
    input = input.split(",");
    let o = JSON.parse(files.toString());
    let om = new Object();

    helper.getTime((err, res, data) => {
      let _time = data.data.t;

      let today_format = helper.transformDate(parseInt(_time));

      om.date = _time;
      om.name = input[0];
      om.sourceUrl = input[1];
      om.url = input[2];
      if (o[today_format]) o[today_format].unshift(om);
      else {
        o[today_format] = [om]
      }


      // o = helper.objectSort(o,()=>{

      // });

      writeInfo.writeInfo(JSON.stringify(o), helper.saveJsonPath, () => {
        showInfo.showNotifi("下载", "下载成功");
      });

    })
  });
  // writeInfo.writeInfo(helper.saveJsonPath)
})

let lastPath = helper.localStorageGet('lastPath');

router.beforeEach((to, from, next) => {
  helper.localStorageSet('lastPath', to.name);
  next();
})

if (lastPath) {
  setTimeout(helper.routerJump(lastPath), 500);
} else helper.routerJump('index');

console.log("getStore", store);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
