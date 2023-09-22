---
title: js window 页面事件
date: 2023-09-22 14:36:33
categories: 前端
tags: window
top_img:
---
## js window 页面事件

```js
window.addEventListener("load", function (e) {
  console.log("load");
});
window.addEventListener("resize", function () {
  console.log("resize", document.body.offsetWidth);
  // console.log("clientWidth", document.body.clientWidth);
});
window.addEventListener("scroll", function (e) {
  console.log("scroll");
});
window.addEventListener("pageshow", function (e) {
  console.log("pageshow");
});
window.addEventListener("pagehide", function (e) {
  // 页面隐藏的时候执行事件
  console.log("pagehide");
});
window.addEventListener("visibilitychange", function (e) {
  console.log("visibilitychange");
});
window.addEventListener("unload", function (e) {
  // 当用户离开页面时触发了事件
  console.log("onunload");
});

window.onbeforeunload = function () {
  // 页面跳转之前执行了事件
  console.log("onbeforeunload");
  localStorage.setItem("onbeforeunload", "1");
};
```