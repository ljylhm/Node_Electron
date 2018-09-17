<template>
    <div class="page-download">
        <!-- 没有下载内容展示区域 -->
        <div class="no-content-o" v-if="!hasContent">
            <div class="nc-show l-center">
                <img src="@static/no-data.png" alt="">
                <p>你暂时还没有下载记录喔~~</p>
            </div>
            <!-- 你暂时还没有下载记录喔~~ -->
        </div>
        <div class="day-item" v-for="(item,key) of list" :key="key" v-else>
            <p class="di-date">{{key}}</p>
            <div class="list-item" v-for="(item1,index1) in item" :key="index1">
                <div class="type-pre">
                    <img src="@static/JPG.png" alt="" class="l-center">
                </div>
                <div class="file-info">
                    <i class="close-i" @click="deleteData(key,index1)">✕</i>
                    <div class="guide-o" @click="openFile(item1.sourceUrl)">
                        <p class="file-title">{{item1.name}}</p>
                        <p class="file-url">{{item1.sourceUrl}}</p>
                    </div>
                    <span class="file-open" @click="openFile(item1.url)">在文件夹中显示</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { helper, readInfo, writeInfo } from "@helper";
    import path from "path";
    import { showInfo } from "@showInfo";
    export default {
        data() {
            return {
                currentTime: "",
                nowStamp: "",
                hasContent: true,
                list: {}
            };
        },
        methods: {
            judgeTime(date) { // 判断是否是今天和昨天
                if (date == this.currentTime) return "今天";
                if (date == this.lastTime) return "昨天";
                return date;
            },
            openFile(url) {
                this.$electron.shell.openExternal(url)
            },
            deleteData(dateItem, item1) { // 删除数据
                if (this.list[dateItem].length == 1) {
                    this.list[dateItem].splice(item1, 1)
                    delete this.list[dateItem];
                } else this.list[dateItem].splice(item1, 1);

                if (Object.keys(this.list).length <= 0) this.hasContent = false;

                // 删除后写入本地
                writeInfo.writeInfo(JSON.stringify(this.list), helper.saveJsonPath, (err) => {
                    if (err) showInfo.message(`写入文件的时候发生了错误，错误路径\n${helper.saveJsonPath}`, "error");
                    else showInfo.message(`成功删除一条下载记录`, "success")
                })
            }
        },
        created() {
            // 进入以后就清空上面的小圆点 __嘿嘿__ 
            helper.getTime((err, res, data) => {
                this.nowStamp = parseInt(data.data.t);
                this.currentTime = helper.transformDate(this.nowStamp);
                readInfo.getFileInfo(helper.saveJsonPath, (files) => {
                    let o = JSON.parse(files.toString());
                    if (Object.keys(o).length <= 0) this.hasContent = false;
                    this.list = helper.objectSort(o, false);
                    console.log("list", this.list);
                });
            })
            this.$store.dispatch("clearLoadNum");

        },
        computed: {
            lastTime: function () {
                return helper.transformDate(this.nowStamp - helper.oneDayTime);
            },
            // hasContent: function () {
            //     return Object.keys(this.list).length > 0
            // }
        }
    }

</script>
<style scoped>
    .page-download {
      width: 100%;
      height: auto;
      padding: 10px 0px;
    }
    .day-item {
      width: 650px;
      height: auto;
      margin: 0 auto;
    }
    .di-date {
      font-size: 14px;
      font-weight: 600;
      padding: 5px 0px 10px 0px;
      color: #616161;
    }

    .list-item {
      width: 100%;
      height: 120px;
      overflow: hidden;
      box-shadow: 0px 2px 5px 2px#ddd;
      margin-bottom: 20px;
      background: #fff;
    }

    .list-item > div {
      position: relative;
      box-sizing: border-box;
      float: left;
    }

    .type-pre {
      width: 80px;
      height: 100%;
      border-right: 1px solid #d8d8d8;
    }

    .type-pre img {
      width: 36px;
      height: 36px;
    }

    .file-info {
      height: 100%;
      font-family: Roboto, "Segoe UI", Arial, "Microsoft Yahei", sans-serif;
      font-size: 14px;
      padding: 16px 10px 10px 15px;
      width: calc(100% - 80px);
    }

    .file-info p {
      padding: 2px 0px;
    }
    .guide-o {
      cursor: pointer;
    }
    /* 关闭的按钮 */
    .close-i {
      position: absolute;
      cursor: pointer;
      top: 2px;
      right: 10px;
    }

    .file-title {
      color: rgb(51, 103, 214);
    }

    .file-url {
      width: 500px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #757575;
    }

    .file-open {
      position: absolute;
      left: 15px;
      bottom: 12px;
      font-size: 14px;
      cursor: pointer;
      font-family: Roboto !important;
      color: rgb(51, 103, 214);
    }

    .no-content-o {
      height: calc(100vh - 66px);
      width: 100vw;
      position: relative;
    }
    .nc-show {
      text-align: center;
      color: #999999;
    }
    .nc-show img {
      width: 100px;
      height: 100px;
    }
</style>