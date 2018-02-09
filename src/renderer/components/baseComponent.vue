<template>
    <div>
        <div>
            <el-button type="text" size="small" @click="base64">
                base64
            </el-button>
        </div>
        <el-dialog ref="base64-2" class="dialog-comm" title="base-64码" append-to-body="true" :visible.sync="dialogVisible" width="50%" @close="closeBase64()" :close-on-click-modal="false">

            <el-input type="textarea" :rows="2" placeholder="请输入内容" readonly v-model="getBaseInfo" :autosize="{ minRows: 6, maxRows: 10 }"></el-input>

            <span slot="footer" class="dialog-footer">
                <el-button @click="copy">复 制</el-button>
                <el-button type="primary" @click="cancelDialog('dialogVisible')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    // base64封装的组件
    import { showInfo } from "@showInfo";
    import { getFileInfo } from "@helper";
    let _this;
    export default {
        data: function () {
            return {
                getBaseInfo: "",
                getPath: "",
                dialogVisible: false
            }
        },
        methods: {
            copy() { // 复制内容
                // 调用剪贴板
                this.$electron.clipboard.writeText(this.getBaseInfo);
                showInfo.message("内容已经复制到剪贴版了", "success");
            },
            cancelDialog(dialogName) {
                this[dialogName] = false;
            },
            openDialog() {
                this.dialogVisible = true;
            },
            closeBase64() {
                this.getBaseInfo = "";
            },
            base64() { // 处理打开base64的方法
                if (!this.getPath) showInfo.message("没有获取到压缩后对应的路径，请重新压缩~~", "warning");
                else {
                    getFileInfo.getBase64(this.getPath, (files) => {
                        if (!files) {
                            showInfo.message("获取出错了-_-,请重试~~", "warning");
                            return;
                        }
                        this.openDialog();
                        this.getBaseInfo = files;
                    });
                }

            }
        },
        created: function () {
            console.log(this.baseInfo);
            // 获得压缩后的路径
            let path = this.baseInfo.gzipPath;
            if (!path) showInfo.message("没有获取到压缩后的路径，请重试~~", "warning");
            else this.getPath = this.baseInfo.path;
        },
        props: [
            // 穿过来的最基本的信息
            "baseInfo",
        ]
    }
</script>

<style scoped>
    /* 弹窗的公用样式 */
    .dialog-comm {
      min-width: 800px;
    }
</style>