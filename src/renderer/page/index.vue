<template>
    <div class="page">
        <div class="page-o"></div>
        <div class="guide-o l-center">
            <div class="guide-i-o" @click="toUrl('gzip-img')">
                <div class="guide-comm guide-1"></div>
                <div class="guide-name">压缩图片</div>
            </div>
            <div class="guide-i-o" @click="toUrl('upLoad')">
                <div class="guide-comm guide-2"></div>
                <div class="guide-name">上传图片</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { helper } from "@helper";
    export default {
        data: function () {
            return {
                mes: "welcome to my.vue"
            }
        },
        methods: {
            toUrl(path) {
                helper.routerJump(path)
            }
        }
    }
</script>

<style scoped>
    .page {
      position: fixed;
      top: 40px;
      width: 100%;
      height: calc(100% - 40px);
    }
    .page-o {
      width: 100%;
      height: 100%;
      min-width: 600px;
      background: url(//bpic.588ku.com/back_pic/00/11/32/3056380c08c1a75.jpg!r850/fw/1600)
        no-repeat center center;
      background-size: cover;
      filter: brightness(50%);
      -webkit-filter: brightness(50%);
    }
    .guide-o > div {
      float: left;
      cursor: pointer;
      width: 120px;
    }
    .guide-comm {
      width: 100%;
      height: 120px;
      box-sizing: border-box;
      padding: 30px;
      border-radius: 50%;
      border: 3px solid rgba(255, 255, 255, 0.8);
    }
    .guide-comm:hover {
      background-color: rgba(255, 182, 193, 0.8);
    }
    .guide-1 {
      background: url("../../../static/guide-1.png") no-repeat center center;
      background-size: 70% 70%;
    }
    .guide-2 {
      background: url("../../../static/guide-2.png") no-repeat center center;
      background-size: 70% 70%;
    }
    .guide-o > div:not(:last-of-type) {
      margin-right: 40px;
    }
    .guide-name {
      width: 100%;
      height: 20px;
      text-align: center;
      color: #fff;
      margin-top: 8px;
      letter-spacing: 2px;
      line-height: 20px;
      font-size: 14px;
    }
</style>