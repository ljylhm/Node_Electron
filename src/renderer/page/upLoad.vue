<template>
    <div class="page-upload">

        <div class="show-count-o comm-block-o">
            <div class="sco-title">
                <div class="sco-1">
                    <p style="font-size: 14px">当前存储量</p>
                    <p style="font-size: 24px">{{currentCount}} MB</p>
                </div>
                <div class="sco-2">
                    <p style="font-size: 14px">平均值</p>
                    <p style="font-size: 24px">{{averageCount}} MB</p>
                </div>
            </div>
            <div id="show-data-count" class="comm-block"></div>
        </div>

        <div class="show-list-o comm-block-o">
            <div class="list-operate">
                <div class="btn-o">
                    <el-button plain @click="dialogVisible_upToken=true">上传文件</el-button>
                    <el-button plain @click="chooseAll">全选</el-button>
                    <el-button plain @click="reloadList">刷新列表</el-button>
                </div>
                <div class="file-show-o">
                    <i class="el-icon-document"></i>
                    <span>共 {{searchFileListData.length　|| 'xxx'}} 个文件</span>
                    <i class="el-icon-tickets"></i>
                    <span>共 {{currentCount ||　'xxx'}} 存储量</span>
                </div>
                <!-- 输入的查询框 -->
                <div class="input-o">
                    <el-input placeholder="输入文件前缀搜索" :debounce=0 class="input-small" prefix-icon="el-icon-search" v-model="searchWhat" @change="searchChange" clearable>
                    </el-input>
                </div>
            </div>
            <el-table :data="searchFileListData" tooltip-effect="dark" @selection-change="handleSelectionChange" ref="resourceData" style="width: 100%" max-height="600" class="show-result-table" :key="'s'">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="key" label="文件名" min-width="260" align="center"></el-table-column>
                <el-table-column prop="mimeType" label="文件类型" min-width="200" align="center"></el-table-column>
                <el-table-column label="存储类型" min-width="200" align="center">
                    <template scope="props">
                        {{props.row.type == 1 ? '低频存储': '标准存储'}}
                    </template>
                </el-table-column>
                <el-table-column label="文件大小" prop="fsize" min-width="100" align="center"></el-table-column>
                <el-table-column label="最后更新" prop="putTime" min-width="200" align="center"></el-table-column>
                <el-table-column fixed="right" label="操作" align="center">
                    <template scope="props">
                        <el-popover placement="left-end" width="300" trigger="click">
                            <div class="pre-title">{{props.row.key}}</div>
                            <div class="pre-img">
                                <img :src="currentDomain+props.row.key" alt="" class="l-center" v-if="props.row.mimeType.indexOf('image') >=0">
                                <div class="show-ban l-center" v-else>
                                    <img src="@static/ban.png" class="l-center" alt="">
                                    <p class="l-center">该文件无法预览</p>
                                </div>
                            </div>
                            <div class="popover-info">
                                <div>
                                    <span>文件大小 :</span>
                                    <span>{{props.row.fsize}}</span>
                                </div>
                                <div>
                                    <span>最后更新 :</span>
                                    <span>{{props.row.putTime}}</span>
                                </div>
                                <div>
                                    <span>外链地址 :</span>
                                    <i class="put-url" @click="getUrl(currentDomain+props.row.key)">{{currentDomain+props.row.key}}</i>
                                </div>
                                <div class="popover-footer">
                                    <el-button round @click="downLoadFile(currentDomain+props.row.key)">下载文件</el-button>
                                    <el-button round @click="copyUrl(currentDomain+props.row.key)">复制外链</el-button>
                                </div>
                            </div>
                            <i class="more-i" slot="reference">
                                <img src="@static/preview.png" alt="">
                            </i>
                        </el-popover>
                        <i class="more-i" @click="deleteImg(props.row.key)">
                            <img src="@static/delete.png" alt="">
                        </i>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="上传配置" class="dialog-comm" :visible.sync="dialogVisible_upToken" :close-on-click-modal="false">
            <div class="uptoken-o">
                <div class="uptoken-o_1">

                </div>
                <div class="uptoken-o_2">

                </div>
            </div>
            <!-- <el-form ref="form" :inline="true" :rules="rule_qiniu" :model="form" status-icon label-width="80px">
                <div class="uptoken-o"></div>

                <br/>
            </el-form> -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="chooseFile">选择文件</el-button>
            </span>
        </el-dialog>

        <el-dialog title="七牛云配置" class="dialog-comm" :visible.sync="dialogVisible_CommOpt" :close-on-click-modal="false">
            <el-form ref="form" :inline="true" :rules="rule_qiniu" :model="form" status-icon label-width="80px">
                <el-form-item label="AccessKey" prop="ak">
                    <el-input class="input-middle" v-model="form.ak"></el-input>
                </el-form-item>
                <el-form-item label="SecretKey" prop="sk">
                    <el-input class="input-middle" v-model="form.sk"></el-input>
                    <!-- <input type="file" class="button-file" ref="fileButton2" @change="bChangeFile"> -->
                </el-form-item>
                <el-form-item label="Bucket" prop="bucket">
                    <el-select v-model="form.bucket" filterable placeholder="请选择" class="input-middle" @change="changeBucket">
                        <el-option v-for="item in options" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    let _this;
    import net from "../../lib/net";
    import E from "../../lib/charts";
    import Qhelper from "../../lib/qiniu";
    import { helper } from "@helper";
    import { showInfo } from "@showInfo";
    let searchVal = (val) => { // 搜索关键词的函数
        _this.searchFileListData.filter((item, index, arr) => {
            return item["key"].indexOf(val) >= 0;
        })
    }
    let transformDate = (data, days = 0) => {
        return new Date((new Date(data).getTime() - helper.oneDayTime * days)).format("yyyy-MM-dd")
    }
    let transformStamp = (timeStamp) => {
        let o = new Object();
        o.year = new Date(timeStamp).getFullYear();
        o.month = new Date(timeStamp).getMonth() + 1;
        o.day = new Date(timeStamp).getDate();
        o.format = new Date(timeStamp).format("yyyy-MM-dd hh:mm:ss")
        return o;
    }
    export default {
        data: function () {
            let checkAk = function (rule, value, callback) {
                if (!value) callback(new Error("请输入您的七牛云AccessKey"));
                else callback();
            }
            return {
                dialogVisible_CommOpt: false,
                dialogVisible_upToken: false,
                form: {
                    ak: "",
                    sk: "",
                    bucket: ""
                },
                currentTime: "",// 当前时间 获取服务器的当前时间
                currentCount: "", // 存储的当前值
                averageCount: "", // 存储的平均值
                bucketList: ["123", "321"],
                fileListData: [],
                searchFileListData: [], // 搜索到的列表数据
                options: [12, 32],
                currentBucket: "liang-img",
                currentDomain: "",
                rule_qiniu: {
                    ak: [{
                        validator: checkAk, trigger: 'blur'
                    }]
                }, // 七牛云的设置
                searchWhat: "", // 搜索的内容
                isChooseAll: false,
                selectItem: []
            }
        },
        methods: {
            searchCount(days) { // 统计存储量
                let data = parseInt(this.currentTime) + helper.oneDayTime;
                let fn = (data) => new Date(data).format("yyyy-MM-dd").replace(/-/g, '') + "000000";
                let end = fn(data),
                    begin = fn(transformDate(data, days)),
                    opt = {
                        bucket: this.currentBucket,
                        begin: begin,
                        end: end,
                        g: "day"
                    };
                let e1 = new E("#show-data-count");

                Qhelper.getInfo("https://api.qiniu.com/v6/space", opt, function (err, res, data) {
                    let xAxis_data = [], yAxis_data = [], countAll = 0;
                    for (let i of data.times) {
                        let t = transformStamp(i * 1000);
                        xAxis_data.push(t.month + "月" + t.day + "日");
                    }

                    for (let i of data.datas) {
                        let t = helper.byteToMb(i);
                        countAll = countAll + parseFloat(t)
                        yAxis_data.push(t);
                    }

                    _this.currentCount = yAxis_data[yAxis_data.length - 1];
                    _this.averageCount = (countAll / days).toFixed(2);

                    e1.setOption({
                        title: {
                            text: "存储量统计"
                        },
                        color: ['#7dce98'],
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            splitLine: {
                                show: false
                            },
                            name: "日期",
                            axisLabel: {
                                textStyle: {
                                    color: '#8f9bb3',//坐标值得具体的颜色
                                }
                            },
                            data: xAxis_data
                        },
                        yAxis: {
                            type: 'value',
                            splitLine: {
                                show: false
                            },
                            axisLabel: {
                                formatter: "{value}",
                                textStyle: {
                                    color: '#8f9bb3',//坐标值得具体的颜色
                                }
                            },
                            name: "MB",
                        },
                        series: [{
                            data: yAxis_data,
                            type: 'line',
                            areaStyle: {}
                        }],
                        boundaryGap: true
                    })

                })
            },
            searchList() {
                let opt = {
                    bucket: this.currentBucket,
                    limit: 1000
                }
                let loadInstance = showInfo.showLoading("正在加载", false, {
                    target: document.querySelector(".show-list-o")
                })
                Qhelper.getInfo("https://rsf.qbox.me/list", opt, (err, res, data) => {
                    showInfo.loadingClose(loadInstance);
                    this.fileListData = data.items;

                    for (let i of this.fileListData) {
                        i.fsize = helper.byteToKb(i.fsize) + " KB";
                        i.putTime = transformStamp(i.putTime / 10000).format;
                    }

                    this.searchChange(this.searchWhat)
                })
            },
            // 查找bucket空间域名
            searchDomain() {
                let opt = {
                    tbl: this.currentBucket,
                }
                Qhelper.getInfo("https://api.qiniu.com/v6/domain/list", opt, (err, res, data) => {
                    this.currentDomain = "http://" + data[0] + "/"; // 第一个域名为测试域名
                })
            },
            // 跳到指定的url链接
            getUrl(link) {
                this.$electron.shell.openExternal(link)
            },
            changeBucket(bucket) {
                this.currentBucket = bucket;
            },
            // 下载链接
            downLoadFile(path) {
                this.$electron.ipcRenderer.send('download', path);
                this.$store.dispatch("addLoadNum");
            },
            // 复制链接
            copyUrl(path) {
                this.$electron.clipboard.writeText(path);
                showInfo.message("内容已经复制到剪贴版了", "success");
            },
            // 刷新列表
            reloadList() {
                this.searchFileListData = [];
                this.searchList();
            },
            // input框的搜索栏
            searchChange(val) {
                let modelListData = Object.assign([], this.fileListData);
                if (val == "") this.searchFileListData = modelListData;
                else {
                    this.searchFileListData = modelListData.filter((item, index, arr) => {
                        return item["key"].indexOf(val) >= 0
                    })
                }
            },
            // 删除七牛云的图片
            deleteImg(name) {
                showInfo.confirmInfo("确定要删除此项目吗?", "删除提示", "warning", function (flag) {
                    if (flag) {
                        let encodeUrl = Qhelper.encodedEntryURI(Qhelper.currentBucket + ":" + name);
                        Qhelper.getInfoPost("https://rs.qiniu.com/delete/" + encodeUrl, {}, (err, res, data) => {
                            if (err) showInfo.message(err, "error");
                            showInfo.message("数据已成功删除^_^", "success");
                            _this.reloadList();
                        });
                    }
                })
            },
            // 选择全部
            chooseAll() {
                this.isChooseAll = !this.isChooseAll;
                if (this.isChooseAll) {
                    for (let i of this.searchFileListData) {
                        this.$refs["resourceData"].toggleRowSelection(i);
                    }
                } else this.$refs["resourceData"].clearSelection();

            },
            handleSelectionChange(val) {
                this.selectItem = val
            },
            chooseFile() {
                this.$electron.remote.dialog.showOpenDialog({ properties: ['openFile'] }, function (data) {
                    data = data || "";
                    console.log(data);
                })
            }
        },
        created: function () {
            _this = this;
        },
        mounted: function () {

            helper.getTime((err, res, data) => {
                this.currentTime = data.data.t;
                this.searchCount(8);
            })
            this.searchList();
            this.searchDomain();
        }
    }
</script>

<style>
    /* 弹窗的公用样式 */
    .page-upload {
      box-sizing: border-box;
      padding: 10px;
    }
    .comm-block-o {
      background-color: #fff;
      margin-bottom: 10px;
    }
    .comm-block {
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
    }
    .dialog-comm {
      min-width: 800px;
    }
    .dialog-comm .el-dialog__footer {
      text-align: center;
    }
    .show-count-o {
      box-sizing: border-box;
      padding: 10px 10px 10px;
    }
    .sco-title {
      width: 87%;
      overflow: hidden;
      margin: 0px auto 10px;
    }
    .sco-title > div {
      width: 50%;
      float: left;
      height: 100%;
    }
    .sco-title p {
      text-align: center;
      color: #5e6166;
      padding: 2px 0px;
    }
    #show-data-count {
      width: 100%;
      box-sizing: border-box;
      margin: 0 auto;
      padding: 10px;
      height: 400px;
    }

    .show-list-o {
      width: 100%;
      min-height: 40px;
      box-sizing: border-box;
      padding: 10px 20px;
      height: auto;
    }
    .show-result-table {
      text-align: center;
    }
    .more-i {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    .more-i img {
      width: 100%;
      height: 100%;
    }
    .pre-img {
      width: 100%;
      height: 200px;
    }

    /* 列表操作区域 */
    .list-operate {
      width: 100%;
      overflow: hidden;
      padding-bottom: 30px;
      height: auto;
    }
    .pre-title {
      text-align: center;
    }
    .pre-img {
      margin: 10px 0px;
      text-align: center;
      position: relative;
    }
    .pre-img img {
      display: inline-block;
      max-width: 100%;
      max-height: 100%;
    }
    .popover-info > div {
      box-sizing: border-box;
      margin-bottom: 10px;
      padding-left: 30px;
      color: #8f9bb3;
    }
    .popover-info i {
      width: 170px;
      word-wrap: break-word;
    }
    .popover-info span {
      display: inline-block;
      font-size: 14px;
      vertical-align: top;
    }
    .popover-footer {
      text-align: center;
    }
    .put-url {
      font-size: 16px;
      cursor: pointer;
      color: #1989fa !important;
    }
    .show-ban {
      width: 150px;
      height: 100px;
      color: #999;
      font-size: 16px;
      background-color: rgba(243, 243, 243, 1);
      border: 1px solid #999;
    }
    .show-ban p {
      width: 100%;
      text-align: center;
    }
    .show-ban img {
      width: 64px;
      height: 64px;
      opacity: 0.5;
    }

    /* 列表的一些按钮区域 */
    .btn-o {
      float: left;
    }
    .input-o {
      float: right;
    }
    .file-show-o {
      float: left;
      padding: 0px 20px;
      color: #606266;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      font-family: core_sans_n45_regular, "Avenir Next", "Helvetica Neue", Helvetica,
        Arial, "PingFang SC", "Source Han Sans SC", "Hiragino Sans GB",
        "Microsoft YaHei", "WenQuanYi MicroHei", sans-serif;
    }
    .file-show-o i {
      margin-left: 25px;
    }

    /* 上传区域的展示区域  */
    .uptoken-o {
      width: 100%;
      margin: 0 auto;
      text-align: center;
      overflow: hidden;
    }
    .uptoken-o > div {
      width: 50%;
      min-height: 50px;
      box-sizing: border-box;
      border: 1px solid #000;
      float: left;
    }
</style>