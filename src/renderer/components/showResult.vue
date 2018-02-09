<template>
    <div class="page-show-result">
        <el-table :data="resultData" border tooltip-effect="dark" ref="showResultTable" style="width: 100%" @row-dblclick="chooseRow" max-height="600" class="show-result-table">
            <el-table-column fixed="left" prop="set" label="压缩状态" width="100">
                <template scope="props">
                    <div class="el-icon-error" style="color:#f56c6c" v-if="props.row.errInfo"></div>
                    <div class="el-icon-success" style="color:#67c23a" v-else></div>
                </template>
            </el-table-column>
            <el-table-column prop="gzipName" label="压缩文件名" width="300">
            </el-table-column>
            <el-table-column prop="gzipPath" label="压缩文件位置" width="500">
            </el-table-column>
            <el-table-column prop="type" label="文件类型" width="100">
            </el-table-column>
            <el-table-column prop="size" label="文件大小/bit before" width="200">
            </el-table-column>
            <el-table-column prop="gzipSize" label="文件大小/bit after" width="200">
            </el-table-column>
            <el-table-column prop="gzipRatio" label="压缩率" width="200">
            </el-table-column>
            <el-table-column fixed="right" prop="set" label="操作" width="80">
                <template scope="props">
                    <base-component :base-info="props.row" ref="baseComponent"></base-component>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    let _this;
    export default {
        data: function () {
            return {
                mes: "welcome to show-result.vue",
                resultData1: [{
                    name: "文件名字",
                    path: "文件位置",
                    isDir: true,
                    type: ".img",
                    size: "12321"
                }],

            }
        },
        methods: {
            chooseRow: function (row, event) { // 选择表格单行文本的
                let path = row["path"];
                if (!path) return;
                this.$electron.shell.openItem(path);
            }
        },
        created: function () {
            _this = this;
        },
        props: [
            'resultData'
        ]
    }
</script>

<style scoped>
    .page-show-result {
      width: 100%;
    }
    .show-result-table {
      text-align: center;
    }
</style>


