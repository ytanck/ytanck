---
title: H5 调用支付宝小程序 Alipay JSAPI
date: 2023-09-22 14:49:16
categories: 
 - [小程序]
tags: 小程序
---
## H5 调用支付宝小程序 Alipay JSAPI

参考链接 [官方文档：](https://opendocs.alipay.com/open/02502i)。
demo：

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.inc.min.js"></script>
    <script src="https://cdn.bootcss.com/vConsole/3.2.0/vconsole.min.js"></script>

    <title>Alipay-demo</title>
  </head>
  <body>
    <div class="parent">
      hello
      <div class="child" contenteditable="true">world</div>
      <button class="btn1" onclick="fn()">点击1</button>
      <button class="btn2">点击2</button>
    </div>
    <script>
      var vConsole = new VConsole();
      function ready(callback) {
        if (window.AlipayJSBridge) {
          callback && callback();
          console.log(1);
        } else {
          console.log("请在支付宝打开");
          document.addEventListener("AlipayJSBridgeReady", callback, false);
          window.AlipayJSBridge = {
            call: function () {
              console.log("mock AlipayJSBridge call");
            },
          };
        }
      }
      ready(function () {
        document.querySelector(".btn2").addEventListener("click", function () {
          AlipayJSBridge.call(
            "beehiveOptionsPicker",
            {
              title: "还款日选择",
              optionsOne: [
                "每周一",
                "每周二",
                "每周三",
                "每周四",
                "每周五",
                "每周六",
                "每周日",
              ],
              selectedOneIndex: 2,
            },
            function (result) {
              alert(JSON.stringify(result));
            }
          );
          // AlipayJSBridge.call(
          //   "chooseContact",
          //   {
          //     title: "choose contacts", // title show on the title bar
          //     multiMax: 2, // max contact items size, default 50
          //     multiMaxText: "max!", // message if selected more than max
          //   },
          //   function (result) {
          //     alert(JSON.stringify(result));
          //   }
          // );
        });
      });
      function fn() {
        AlipayJSBridge.call("toast", {
          content: "请填写正确的姓名",
          type: "none",
          duration: 2000,
        });
      }
    </script>
  </body>
</html>
```

用 open with live server 方式打开生成二维码，然后用支付宝扫码预览

