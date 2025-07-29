<template>
  <router-view></router-view>
</template>

<script setup>
// 解决el-table打开报错问题 ResizeObserver loop completed with undelivered notifications.
const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 200);
    super(callback);
  }
}
</script>

<style>
  html,body {
    margin: 0;
    padding: 0;
    background-color: #ffffff;
    height: 100%;
    width: 100%;
  }
  a {
    text-decoration: none;
  }
  @font-face {
    font-family: mySfProTextRegular;
    src: url('./assets/fonts/SF-Pro-Text-Regular.otf');
  }
  #app {
    font-family: 'mySfProTextRegular', 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
  }

  .main {
    width: 100%;
    margin: 0 auto;
    height: 100%;
    overflow: auto;
  }

  .page {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  .page-title {
    background-color: #eaeaea;
    height: 45px;
    line-height: 45px;
    margin-top: -21px;
    padding-left: 10px;
    margin-bottom: 16px;
  }

  .header_row_class {
    background-color: #f3f9f9 !important;
    color: #6E7484;
  }
</style>
