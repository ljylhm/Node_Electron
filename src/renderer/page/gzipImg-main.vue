<template>
    <div class="page">
        <div class="drag-input" v-dragable>
            <div class="no-file">
                <i class="add-file l-center" @click="openFile">
                    <input type="file" @change="changeFile" alt="" multiple="multiple" ref="fileButton">
                    <img src="@static/add.png" alt="" class="l-center">
                </i>
            </div>
        </div>

        <div class="show-data">
            <div class="has-file">
                <el-table :data="fileData" border tooltip-effect="dark" ref="multipleTable" style="width: 100%" @row-dblclick="chooseRow" @selection-change="changeSelection" max-height="600" class="re-el-table">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column label="排序" type="index" width="50">
                    </el-table-column>
                    <el-table-column prop="name" label="文件名" width="300">
                    </el-table-column>
                    <!-- <el-table-column width="100" label="预览图">
                        <template scope="props">
                            <img :src="props.row.transformPath" alt="" class="pre-view" v-if="checkIsImg(props.row.type)">
                            <span v-else>无预览图</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="path" label="文件位置" width="500">
                    </el-table-column>
                    <el-table-column label="是否文件夹" width="100">
                        <template scope="props">
                            {{props.row.isDir? "是":"否"}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="文件类型" width="100">
                    </el-table-column>
                    <el-table-column prop="size" label="文件大小/bit" width="200">
                    </el-table-column>
                    <el-table-column fixed="right" prop="set" label="操作" width="150">
                        <template scope="props">
                            <el-button type="text" size="small" @click="chooseRow(props.row)">查看</el-button>
                            <el-button type="text" size="small" @click="base64(props.row)">base64</el-button>
                            <el-button type="text" size="small" @click="removeItem(props.$index)">移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 对表格操作的区域 -->
            <div class="operating" v-show="isOperate">
                <el-button type="primary" @click="gzipAll('multipleTable','fileData')">全部压缩</el-button>
                <el-button type="primary" @click="gzipSelected">选中压缩</el-button>
                <el-button type="primary" @click="removeAll">全部移除</el-button>
            </div>
        </div>

        <div class="show-gzip-result" v-if="gzipData.length>0 && fileData.length>0">
            <show-result :resultData="gzipData"></show-result>
        </div>

        <!-- 弹窗区域  -->
        <el-dialog class="dialog-comm" title="配置" :visible.sync="dialogVisible" width="50%" @close="handleClose('form')" :close-on-click-modal="false">

            <el-form ref="form" :inline="false" :rules="rules1" :model="form" label-width="80px">
                <el-form-item label="选择路径" prop="toPath">
                    <el-input v-model="form.toPath" readonly class="input-small"></el-input>
                    <!-- <input type="file" class="button-file" ref="fileButton2" @change="bChangeFile"> -->
                    <el-button type="primary" @click="buttonChoose">选择</el-button>
                </el-form-item>
                <el-form-item label="添加后缀">
                    <el-switch v-model="form.isExt" @change="changeSwitch"></el-switch>
                </el-form-item>
                <el-form-item label="后缀名" v-if="form.isExt" prop="extname">
                    <el-input v-model="form.extname" class="input-small"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDialog('dialogVisible')">取 消</el-button>
                <el-button type="primary" @click="sureDialog('form')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog ref="base64" class="dialog-comm" title="base-64码" :visible.sync="base64DialogVisible" width="50%" @close="closeBase64()" :close-on-click-modal="false">

            <el-input type="textarea" :rows="2" placeholder="请输入内容" readonly v-model="base64Info" :autosize="{ minRows: 6, maxRows: 10 }"></el-input>

            <span slot="footer" class="dialog-footer">
                <el-button @click="copy">复 制</el-button>
                <el-button type="primary" @click="cancelDialog('base64DialogVisible')">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    let _this; // 全局的this对象
    import { helper, checking, getFileInfo, readInfo } from "@helper";
    import { showInfo } from "@showInfo";
    import { compressAll, validate, setKey } from "@lib/gzip.js";
    export default {
        data: function () {
            let checkPath = function (rule, value, callback) { // 校验提交信息的表单
                if (!value && !_this.form.toPath) callback(new Error("请选择路径wo~"));
                else if (!checking.isDir(value)) callback(new Error("请选择文件夹喔~"));
                else callback();
            };
            let checkExt = function (rule, value, callback) {
                if (!value) callback(new Error("请输入后缀名"))
                else callback();
            }
            return {
                mes: "welcome to gzipImg.vue",
                isFileData: false, // 是否有文件过来
                fileData: [],
                selectionData: [], // 最后选中的数据
                gzipData: [], // 压缩后的数据
                dialogVisible: false, // 弹窗是否关闭
                base64DialogVisible: false, // base64的展示弹窗
                base64Info: "", // base64转码后的信息
                isOperate: false,
                form: { // 表单配置的基本信息
                    toPath: "",
                    extname: "",
                    isExt: false
                },
                rules1: {
                    toPath: [
                        { validator: checkPath, trigger: 'change' }
                    ],
                    extname: [
                        { validator: checkExt, trigger: 'blur' }
                    ]
                }
            }
        },
        directives: {
            dragable: {
                // 插入时候的钩子函数
                inserted: function (el) {
                    el.addEventListener("drop", function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        _this.dragFiles(e.dataTransfer.files)
                    })
                    el.addEventListener('dragover', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                }
            }
        },
        methods: {
            buttonChoose() {
                this.$electron.remote.dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] }, function (data) {
                    data = data || "";
                    if (data) _this.form.toPath = data[0];
                })
            },
            changeFile: function () {
                let arr = this.$refs["fileButton"].files || [];
                this.setFiles(arr)
            },
            dragFiles: function (arr) {
                this.setFiles(arr)
            },
            setFiles: function (arr) {
                let getData = this.openFile(arr);
                if (getData && getData.length > 0) {
                    this.fileData = getData;
                    this.isFileData = true;
                }
                this.isOperate = true;
            },
            // 打开文件的函数
            openFile(dataFiles) {
                if (dataFiles.length <= 0) return;
                let files = dataFiles,
                    len = files.length,
                    arr = new Array();
                for (let i = 0; i < len; i++) {
                    arr.push(this.commSetData(files[i]));
                }
                return arr;
            },
            // 通用设置数据
            commSetData(file) {
                let s = { name: "", type: "", path: "", size: "", isDir: "" };
                for (let i in s) {
                    if (i == "isDir") continue;
                    s[i] = file[i]
                }
                s["type"] = getFileInfo.getExtName(s["path"]);
                s["isDir"] = checking.isDir(s.path);
                s["transformPath"] = window.URL.createObjectURL(file);
                return s;
            },

            // 单元格选择某一行的事件
            chooseRow: function (row, event) {
                let path = row["path"];
                if (!path) return;
                this.$electron.shell.openItem(path);
            },
            // 移除表格中的某一行数据
            removeItem: function (index) {
                if (!index && index != 0) {
                    showInfo.message("顺序出错了,嘿嘿，请再试一次~~", "error");
                    return;
                };
                this.fileData.splice(index, 1);
            },
            removeAll() {
                this.fileData = [];
                this.isOperate = false;
                this.gzipData = [];
            },
            // 改变某一行的状态
            toggleSelection(ref = "multipleTable", rows) {
                this.$refs[ref].toggleRowSelection(row);
            },
            // 选中表格某个状态
            changeSelection(val) {
                this.selectionData = val;
            },
            // 改变swithc的状态
            changeSwitch(newV) {
                this.form.isExt = newV;
            },
            /**
            * @description 选中压缩的全部
            * @param {String} ref 对应的表格ref区分
            * @param {String} dataName 对应数据名字
            */
            gzipAll(ref, dataName) {
                if (!dataName || !ref) return;
                for (let i of this[dataName]) {
                    this.$refs[ref]["toggleRowSelection"](i);
                };
                this.selectionData = this.fileData;

                // 打开弹窗
                this.dialogVisible = true;
            },
            gzipSelected() {
                if (this.selectionData.length <= 0) showInfo.message("你什么都没有选喔~~", "warning")
                else {
                    this.dialogVisible = true;
                }
            },
            checkIsImg(type) {
                let typeList = ["png", "jpg"],
                    isIncludes = false;
                for (let i of typeList) {
                    if (type.indexOf(i) >= 0) isIncludes = true;
                }
                return isIncludes;
            },
            handleCloseComm(refname) {
                this.$refs[refname].resetFields();
            },
            handleClose(refname) {
                this.handleCloseComm(refname);
                this.form.isExt = false;
            },
            closeBase64() {
                this.base64Info = "";
            },
            cancelDialog(dialogName) {
                this[dialogName] = false;
            },
            sureDialog(refname) {
                this.$refs[refname].validate((valid) => {
                    if (valid) {
                        if (!this.selectionData) showInfo.message("你没有选择数据或者发生了异常，请刷新页面重试~~");
                        this.selectionData = this.selectionData || {};
                        compressAll(this.selectionData, _this.gzipData, this.form, function (data) {
                            _this.dialogVisible = false;
                            console.log(_this.gzipData);
                            console.log("完全结束了");
                        });
                    } else {
                        return false;
                    }
                })
            },
            copy() { // 复制内容
                // 调用剪贴板
                this.$electron.clipboard.writeText(this.base64Info);
                showInfo.message("内容已经复制到剪贴版了", "success");
            },
            base64(row) { // 处理打开base64的方法
                let path = row.path;
                getFileInfo.getBase64(path, (files) => {
                    this.base64Info = files;
                    this.base64DialogVisible = true;
                });
            }
        },
        created() {
            _this = this;
        }
    }
</script>

<style>
    .page {
      position: relative;
    }
    .drag-input {
      min-width: 500px;
      height: 220px;
      position: relative;
    }

    .show-data {
      width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
    }

    .add-file {
      display: inline-block;
      cursor: pointer;
      width: 100px;
      height: 100px;
      border: 1px dashed #ddd;
    }

    .add-file::after {
      width: 100%;
      height: 20px;
      text-align: center;
      position: absolute;
      color: #999999;
      top: 110%;
      content: "请将文件或文件夹拖入这里";
    }

    .add-file:hover {
      border: 1px dashed #409eff;
    }

    .add-file input[type="file"] {
      opacity: 0;
      cursor: pointer;
      position: absolute;
      z-index: 1001;
      width: 100px;
      height: 100px;
    }

    #fileButton:hover .add-file {
      border: 1px dashed #409eff;
    }

    .re-el-table {
      text-align: center;
    }
    .re-el-table .el-table_fixed-right {
      bottom: 10px !important;
    }

    .operating {
      width: 100%;
      height: 50px;
      margin-top: 20px;
      box-sizing: border-box;
      padding: 0px 20px;
      text-align: right;
      min-width: 500px;
    }

    .pre-view {
      width: 100%;
      height: 100%;
    }

    .show-right {
      float: left;
      width: calc(100%-100px);
    }

    .slide-o {
      position: fixed;
      left: 0px;
      width: 160px;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      margin: 0px;
      padding: 0px;
      background-color: #252a2f;
      box-shadow: 1px 0px 1px 0px#ddd;
      height: calc(100% - 40px);
    }

    .cont-o {
      width: calc(100% - 160px);
      box-sizing: border-box;
      padding: 10px;
      margin-left: 160px;
      height: auto;
      float: left;
    }

    .cont-o > div {
      background-color: #fff;
      margin-bottom: 20px;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    }

    .button-file {
      opacity: 0;
      width: 70px;
      height: 40px;
      cursor: pointer;
      position: absolute;
      border: 1px solid #000;
    }

    .show-gzip-result {
      margin-top: 20px;
    }

    /* 弹窗的公用样式 */
    .dialog-comm {
      min-width: 800px;
    }
</style>