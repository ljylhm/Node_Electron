/**
 * @description 用来保存压缩的历史记录
 */
import { checking } from "@helper"
const savePath = "C:/LCompress/history"

let saveJson = {
    createT: "", // 创建的时间
    lastmodified: "", // 最近一次修改的时间
    images: [] // 压缩的图片内容
}

// 下载记录的统计信息
let downLoadJson = {
    createT:"", // 创建的时间
    filename:"", // 文件的名字
    isExist:"", // 是否存在 文件是否还存在 有可能被删除
    downLoadUrl: "" // 下载链接  
}


