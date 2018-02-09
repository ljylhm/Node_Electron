<template>
    <div class="page-slide">
        <el-menu default-active="1" class="el-menu-vertical-demo" background-color="#252a2f" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="1">
                <i class="el-icon-document"></i>
                <span slot="title">TinyPng</span>
            </el-menu-item>
            <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">历史记录</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                mes: "welcome to showDialog.vue"
            }
        },
    }
</script>

<style>
    .page-slide {
      width: 100%;
    }
    .page-slide::-webkit-scrollbar-track-piece {
      /*滚动条凹槽的颜色，还可以设置边框属性*/
      background-color: #f8f8f8;
    }
    .page-slide::-webkit-scrollbar {
      /*滚动条的宽度*/
      width: 2px;
      height: 9px;
    }
    .page-slide::-webkit-scrollbar-thumb {
      /*滚动条的设置*/
      background-color: #dddddd;
      background-clip: padding-box;
      border-radius: 50%;
      min-height: 10px !important;
    }
    .page-slide::-webkit-scrollbar-thumb:hover {
      background-color: #bbb;
    }

    .item {
      width: 100%;
      height: 60px;
    }
    .page-slide .el-menu-item {
      min-width: 0px;
    }
</style>