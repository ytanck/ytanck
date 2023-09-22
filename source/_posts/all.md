---
title: 小案例
date: 2023-08-31 16:03:48
categories: 
 - [前端]
tags: JavaScript
---



## 修改数组对象的属性（key）名

方法一

```js
var array = [
  { id: 1, name: "小明" },
  { id: 2, name: "小红" },
];
/**/
//旧key到新key的映射
var keyMap = { id: "value", name: "label" };

for (var i = 0; i < array.length; i++) {
  var obj = array[i];
  for (var key in obj) {
    var newKey = keyMap[key];
    if (newKey) {
      obj[newKey] = obj[key];
      delete obj[key];
    }
  }
}
console.log(array);
```

方法二

```js
let arr = [
  { evaluateResult: "A类", evaluateTotal: 22, a: 1 },
  { evaluateResult: "B类", evaluateTotal: 22, b: 2 },
];
let keyMap = { evaluateResult: "name", evaluateTotal: "value" };
arr.map((item) => {
  var objs = Object.keys(item).reduce((newData, key) => {
    let newKey = keyMap[key] || key;
    newData[newKey] = item[key];
    return newData;
  }, {});
  console.log(objs);
  //{name: "A类", value: 22, a: 1}
  //{name: "B类", value: 22, b: 2}
});
```

方法三

```js
this.categoryOption = res.data.map(item => {
          return {
            value: item.id,
            label: item.name,
            children: item.sonList.map(sonItem => {
              return {
                value: sonItem.id,
                label: sonItem.name
              };
            })
    console.log(this.categoryOption);
```



## JS 时间对象 new Date()的常用方法

```js
new Date(), //Sat May 22 2021 10:38:06 GMT+0800 (中国标准时间)
//返回时间戳
+new Date(); //1621651748005
Date.now();//1621651748005
new Date().getTime()//1621651748005

new Date().toJSON(), //2021-05-22T02:38:06.765Z
new Date().toISOString(), //2021-05-22T02:38:06.765Z
new Date().toDateString(), //Sat May 22 2021

new Date().toLocaleString(), //2021/5/22上午10:38:06
new Date().toLocaleDateString(), //2021/5/22
new Date().toLocaleTimeString(), //"上午10:40:24"
//加参数的
new Date(1621541748005).toLocaleString()//2021/5/21上午4:15:48

getDate()获取当前日期对象是几日(1-31)
getDay()获取当前日期对象是周几(返回0-6.0表示周日.1表示周一)
getMonth()获取当前月份(0-11.0表示一月.11表示12月)
geFullYear()获取当前年份
geHours()获取小时(0-23)
geMinutes()获取分钟(0-59)
geSeconds()获取秒数(0-59)
geMilliseconds()获取毫秒数
```

## js base64 转二进制 Blog 大对象

imgURL = canvas.toDataURL(“image/png”);//返回的是 data:image/png;base64,iVBORxxxx…
imgURL=URL.createObjectURL(/blob/对象);//返回的是 data:image/png;base64,iVBORxxxx…

下面是将 base64 的 URL 转换成 Blob 对象
1.Base64 转文件格式大小（带有前缀的截取，比如 data:application/pdf;base64,JVEwxxx…）

```js
function base64toBlob(dataurl, filename) {
  将base64转换为文件;
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
```

2.Base64 转 blob 格式大小（不用处理前缀）

```js
function base64toBlob(base64, type) {
  // 将base64转为Unicode规则编码
  (bstr = atob(base64, type)), (n = bstr.length), (u8arr = new Uint8Array(n));
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n); // 转换编码后才可以使用charCodeAt 找到Unicode编码
  }
  return new Blob([u8arr], {
    type,
  });
}
```

下载图片

```js
let a = document.createElement("a");
a.download = "image";
a.href = URL.createObjectURL(blob);
a.click();
URL.revokeObjectURL(blob);

//html2canvas(canvasID).then()插件可实现截图效果
```

## vue 中的 render 函数介绍

使用 render 函数描述虚拟 DOM 时，vue 提供一个函数，这个函数是就构建虚拟 DOM 所需要的工具。官网上给他起了个名字叫 createElement。还有约定的简写叫 h,

vm 中有一个方法\_c,也是这个函数的别名。

```js
 /**
  * render: 渲染函数
  * 参数: createElement
  * 参数类型: Function
 */
 render: function (createElement) {
   let _this = this['$options'].parent	// 我这个是在 .vue 文件的 components 中写的，这样写才能访问this
   let _header = _this.$slots.header   	// $slots: vue中所有分发插槽，不具名的都在default里
/**
    * createElement 本身也是一个函数，它有三个参数
    * 返回值: VNode，即虚拟节点
    * 1. 一个 HTML 标签字符串，组件选项对象，或者解析上述任何一种的一个 async 异步函数。必需参数。{String | Object | Function} - 就是你要渲染的最外层标签
    * 2. 一个包含模板相关属性的数据对象你可以在 template 中使用这些特性。可选参数。{Object} - 1中的标签的属性
    * 3. 子虚拟节点 (VNodes)，由 `createElement()` 构建而成，也可以使用字符串来生成“文本虚拟节点”。可选参数。{String | Array} - 1的子节点，可以用 createElement() 创建，文本节点直接写就可以
    */
   return createElement(
     // 1. 要渲染的标签名称：第一个参数【必需】
     'div',
     // 2. 1中渲染的标签的属性，详情查看文档：第二个参数【可选】
     {
       style: {
         color: '#333',
         border: '1px solid #ccc'
       }
     },
     // 3. 1中渲染的标签的子元素数组：第三个参数【可选】
     [
       'text',   // 文本节点直接写就可以
       _this.$slots.default,  // 所有不具名插槽，是个数组
       createElement('div', _header)   // createElement()创建的VNodes
     ]
   )
 }
```

就是说 createElement（params1，params2，params3）接受三个参数，每个参数的类型官方介绍已经说明
**render 函数的用法**

```js
render: (h) => {
  return h("div", {
    //给div绑定value属性
    props: {
      value: "",
    }, //给div绑定样式
    style: {
      width: "30px",
    }, //给div绑定点击事件
    on: {
      click: () => {
        console.log("点击事件");
      },
    },
  });
};
```

