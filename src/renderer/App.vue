<template>
  <div id="app">
    <div class="nav">
      <div class="nav-i nav-icon" @click="toUrl('index')">
        <i>
          <img src="@static/icon.png" alt="">
        </i>
      </div>
      <div class="nav-o l-x-center">
        <div class="nav-i" @click="toUrl('gzip-img')">
          <i>
            <img src="@static/gzip.png" alt="">
          </i>
          压缩图片
        </div>
        <div class="nav-i" @click="toUrl('upLoad')">
          <i>
            <img src="@static/upload.png" alt="">
          </i>
          图片上传
        </div>

        <div class="nav-i" @click="toUrl('download')">
          <i>
            <img src="@static/download.png" alt="">
          </i>
          <el-badge :is-dot="isDot>0" class="show-nav-dot">
            <span>我的下载</span>
          </el-badge>
        </div>
      </div>
    </div>
    <div class="router-view-o">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import { helper } from "@helper";
  let _this;
  export default {
    name: 'gzipimg',
    data: function () {
      return {
        ss: [1, 2],
        name: 123
      }
    },
    methods: {
      toUrl: function (path) {
        helper.routerJump(path);
      }
    },
    created() {
      console.log('_____', this.$store.state.Download.newDownNum);
    },
    computed: {
      isDot: function () {
        return this.$store.state.Download.newDownNum
      }
    }
  }
</script>

<style>
  #app {
    width: 100%;
    height: auto;
  }
  /* 导航栏 */
  .nav {
    position: fixed;
    opacity: 1;
    z-index: 1000;
    width: 100%;
    height: 40px;
    min-width: 800px;
    /* background-color: #f5f5f5; */
    background-color: #252a2f;
    color: #fff;
    box-shadow: 0px 0px 3px 0px#000;
  }

  .nav-o {
    height: 100%;
  }

  .nav-i {
    text-align: center;
    line-height: 40px;
    float: left;
    padding: 0px 20px;
    cursor: pointer;
    height: 100%;
  }

  .nav-i > i {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 0px;
    position: relative;
    top: 3px;
  }

  .nav-i > i img {
    width: 100%;
    height: 100%;
  }

  .nav-icon > i {
    width: 35px !important;
    height: 35px !important;
    border-radius: 50%;
    background-color: #fff;
    box-sizing: border-box;
    padding: 2px;
  }

  .show-nav-dot .el-badge__content.is-fixed {
    top: 5px;
    height: 6px;
    width: 6px;
  }
</style>
