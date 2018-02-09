<template>
  <div id="wrapper">
    <!-- <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload> -->
  </div>
</template>

<script>

  export default {
    name: 'landing-page',
    data: function () {
      return {
        value1: ''
      }
    },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link)
      },
      testClick() {
        this.$electron.ipcRenderer.send('test', '123321')
      }
    },
    mounted: function () {

    }
  }
</script>

<style>
  @import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: "Source Sans Pro", sans-serif;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div {
    flex-basis: 50%;
  }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: 0.8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }

  .test-drag {
    width: 100%;
    height: 200px;
    border: 1px solid #000;
  }

  .test-drag-i {
    width: 40px;
    height: 40px;
    cursor: pointer;
    border: 1px solid #000;
  }
</style>
