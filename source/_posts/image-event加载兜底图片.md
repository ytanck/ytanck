---
title: 图片加载不出来，使用默认图片的三种方法
date: 2023-09-22 14:47:30
categories:
tags:
top_img:
---
## vue 自定义指令，图片加载不出来，使用默认图片的三种方法

### 一、常规解决方法

我们都知道，img 标签支持 onerror 事件，在装载文档或图像的过程中如果发生了错误，就会触发 onerror 事件。可以使用一张提示错误的图片代替显示不了的图片。

```js
<img src="images/logo.png" onerror="javascript:this.src='images/logoError.png';">
```

当图片不存在时，将触发 onerror，而 onerror 中又为 img 指定一个 logoError.png 图片。也就是说图片存在则显示 logo.png，图片不存在将显示 logoError.png。
但是，注意哦，这里有个大坑哦，如果 logoError.png 也不存在，则会继续触发 onerror，导致死循环，页面卡死。而且，就算图片存在，但网络很不通畅，也可能触发 onerror。
当然，解决办法是有的：

```js
<img src="images/logo.png" onerror="notfound();"/>

<script type="text/javascript">
    function notfound() {
        var img = event.srcElement;
        img.src = "images/logoError.png";
        img.onerror = null; //解绑onerror事件
    }
</script>
```

### 二、通过[vue](https://so.csdn.net/so/search?from=pc_blog_highlight&q=vue)绑定 onerror 实现

```js
// 本质上跟第一种方法是差不多的,这里也会遇到跟第一种方法类似的问题，当默认图也不存在时，图片加载死循环。
<img :src="images/logo.png" :onerror="defaultImg">

<script>
    export default {
        name: "imgError",
        data() {
            return {
                defaultImg: 'this.src="' + require('images/logoError.png') + '"' //默认图地址
            }
        }
    }
</script>
```

### 三、通过 vue 自定义指令

使用 vue 的指令都感觉好爽，特别的方便，现在自己搞一个，用起来会更爽。

在这之前，先了解下 vue 的自定义指令到底怎么玩，还是很有必要的。
这种东西呢，还是看文档吧，文档写得挺详细的。[vue 指令](https://cn.vuejs.org/v2/guide/custom-directive.html)。

demo1:

```js
//全局注册自定义指令，用于判断当前图片是否能够加载成功，可以加载成功则赋值为img的src属性，否则使用默认图片
Vue.directive("real-img", async function (el, binding) {
  //指令名称为：real-img
  let imgURL = binding.value; //获取图片地址
  if (imgURL) {
    let exist = await imageIsExist(imgURL);
    if (exist) {
      el.setAttribute("src", imgURL);
    }
  }
});

/**
 * 检测图片是否存在
 * @param url
 */
let imageIsExist = function (url) {
  return new Promise((resolve) => {
    var img = new Image();
    img.onload = function () {
      if (this.complete == true) {
        resolve(true);
        img = null;
      }
    };
    img.onerror = function () {
      resolve(false);
      img = null;
    };
    img.src = url;
  });
};
```

然后使用的时候就特别方便了，因为是全局注册的，所以每个页面都可以直接使用

```js
<!--v-real-img 就是刚刚定义的指令，绑定的为真实要显示的图片地址。src为默认图片地址-->
<img src="images/logoError.png" v-real-img="images/logo.png">
```

使用这种方法还有一个天然的优势，那就是当网速较慢或者图片一次性加载较多的话，可以达到占位图的效果。

demo2:

```js
Vue.directive('errorimg' ,{
	//执行时机：绑定了当前指令的元素的所有属性和事件
	inserted(el){
		//获取的是真是的dom元素，可以使用dom的所有事件
		console.log(el)
		el.onerror = function(){
			//将默认图片赋值给el.src属性
			el.src = '默认图片地址'
		}
	}，
	//如果有分页，会在第二页的不会渲染，这个时候我们就换个函数
	componentUpdated: function (el) {
		el.src = '默认图片地址'
	},
})

```

**自定义指令简写**
在很多时候，你可能想在 bind 和 update 时触发相同行为，而不关心其它的钩子。可以简写为:
全局

```js
Vue.directive("color", function (el, binding) {
  el.style.backgroundColor = binding.value;
});
```

局部

```js
directives: {
        "fontweight":
        	function (el, binding) {
             	el.style.fontWeight = binding.value;
        	}
}
```
