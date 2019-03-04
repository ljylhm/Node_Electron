# husky

> electron png jpg gif

#### 前言
 最近在捣鼓electron，因为使用vue已经有一段时间了，所以使用了vue-electron来当做我的主要框架。（应该不能算框架，可以算个库吧，集合webpack把我们吧开发环境搭建好，后期的打包也做了封装，总的来说用起来感觉很不错）。
 #### 结构图
 ![Image text](https://file.40017.cn/huochepiao/activity/20180918test/结构目录图.png?180918190849)
 #### 路由结构图
  路由结构花了蛮长时间弄的，主要是想把导入路由变得简单，现在我们使用的方法无论怎样都是要去route.js里面导入相对应的vue;在webpack环境中利用require.context来遍历布局的vue文件夹，并通过定义的规则和使用递归来处理层级路由的关系。
 ![Image text](https://file.40017.cn/huochepiao/activity/20180920test/路由分析图.png)
#### 预览图片
  首页展示
 ![Image text](http://file.40017.cn/huochepiao/activity/MyPic/index.png)
  压缩图片
 ![Image text](http://file.40017.cn/huochepiao/activity/MyPic/gzip.png)
  获得七牛云
 ![Image text](http://file.40017.cn/huochepiao/activity/MyPic/load.png) 
  下载列表
 ![Image text](http://file.40017.cn/huochepiao/activity/MyPic/picupload.png) 
