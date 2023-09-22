---
title: js倒计时
date: 2023-09-22 14:44:39
categories: 前端
tags:
top_img:
---
## JS 实现倒计时功能

html

```js
<html>
  <head>
    <meta charset="UTF-8" />
    <title>30分钟倒计时</title>
  </head>
  <body>
    <div id="timer" style="color: red"></div>
  </body>
  <script type="text/javascript">
    var oBox = document.getElementById("timer");
    var maxtime = 30 * 60;
    function CountDown() {
      if (maxtime >= 0) {
        minutes = Math.floor(maxtime / 60);
        seconds = Math.floor(maxtime % 60);
        msg = "距离结束还有" + minutes + "分" + seconds + "秒";
        oBox.innerHTML = msg;
        if (maxtime == 5 * 60) alert("还剩5分钟");
        --maxtime;
      } else {
        clearInterval(timer);
        alert("时间到，结束!");
      }
    }
    timer = setInterval("CountDown()", 1000);
  </script>
</html>

```

vue

```js
//data中定义 minutes, seconds
//methods中的方法
 madeTime() {
 	  //let now = new Date().getTime();
      // 设置截止时间
      //let end = new Date(this.curStartTime).getTime();
      //let maxtime = end - now;

      var maxtime = 30 * 60; //30分钟(1800秒)
      // var minutes, seconds, msg;
      var _this = this;
      var timer = setInterval(() => {
        if (maxtime >= 0) {
          _this.minutes = Math.floor(maxtime / 60)
            .toString()
            .padStart(2, "0");
          _this.seconds = Math.floor(maxtime % 60)
            .toString()
            .padStart(2, "0");
          // msg = "距离结束还有" + minutes + "分" + seconds + "秒";
          if (maxtime == 5 * 60) alert("还剩5分钟");
          --maxtime;
        } else {
          clearInterval(timer);
          alert("时间到，结束!");
        }
      }, 1000);
    }
```