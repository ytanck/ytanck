---
title: 使用CSS实现进度条和饼图
date: 2023-05-01 13:26:18
categories: 前端
tags: CSS
---

进度条，是我们日常界面中使用的非常多的一种，下面我们来看看。到今天，我们可以如何实现进度条。

## HTML 标签 -- meter & progress

这个可能是一些同学还不太清楚的，HTML5 原生提供了两个标签 `<meter>` 和 `<progress>` 来实现进度条。

- `<meter>`：用来显示已知范围的标量值或者分数值
- `<progress>`：用来显示一项任务的完成进度，通常情况下，该元素都显示为一个进度条

我们分别来看看，首先是 `<meter>` 标签：

```js
<p>
  <span>完成度：</span>
  <meter min="0" max="500" value="350">
    350 degrees
  </meter>
</p>
```

```js
meter {
    width: 200px;
}

```

样式如下：

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process1.webp)

其中，`min`、`max`、`value` 分别表示最大值，最小值与当前值。

无独有偶，我们再来看看 `<progress>` 标签的用法：

```js
<p>
  <label for="file">完成度：</label>
  <progress max="100" value="70">
    {" "}
    70%{" "}
  </progress>
</p>
```

```js
progress {
    width: 200px;
}

```

样式如下：

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process2.webp)

其中，`max` 属性描述这个 progress 元素所表示的任务一共需要完成多少工作量，`value` 属性用来指定该进度条已完成的工作量。

### meter & progress 之间的差异

那么问题来了，从上述 Demo 看，两个标签的效果一模一样，那么它们的区别是什么？为什么会有两个看似一样的标签呢？

这两个元素最大的差异在于**语义上的差别**。

- `<meter>`：表示**已知范围内的标量测量值或分数值**
- `<progress>`：表示**任务的完成进度**

譬如，一个需求当前的完成度，应该使用 `<progress>`，而如果要展示汽车仪表盘当前的速度值，应该使用 `meter`。

### meter & progress 的局限性

当然，在实际的业务需求中，或者生产环境，你几乎是不会看到 `<meter>` 和 `<progress>` 标签。

和我们在这篇文章中 -- 《利用 datalist 实现可过滤下拉选框》[1] 讲到的原因类似，在于：

1. 我们无法有效的修改 `<meter>` 和 `<progress>` 标签的样式，譬如背景色，进度前景色等。并且，最为致命的是，浏览器默认样式的表现在不同浏览器之间并不一致。这给追求稳定，UI 表现一致的业务来说，是灾难性的缺点！
2. 我们无法给他添加一些动画效果、交互效果，因为一些实际的应用场景中，肯定不是简单的展示一个进度条仅此而已

## 利用 CSS 实现进度条

因此，在现阶段，更多的还是使用一些 CSS 的方式去实现进度条。

### 使用百分比实现进度条

最为常见的一种方式是使用背景色配合百分比的方式制作进度条。

最简单的一个 DEMO：

```js
<div class="g-container">
  <div class="g-progress"></div>
</div>
```

```js
.g-container {
    width: 240px;
    height: 25px;
    border-radius: 25px;
    background: #eee;
}
.g-progress {
    width: 50%;
    height: inherit;
    border-radius: 25px 0 0 25px;
    background: #0f0;
}

```

效果如下：

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process3.webp)

这种方式优势在于使用简单，实际进度可以非常方便的传递进 CSS 中

1. 利用 HTML `style` 属性填写完整的 `width` 值，譬如 `<div class="g-progress" style="width: 50%"></div>`
2. 或者利用 CSS 自定义属性 `<div class="g-progress" style="--progress: 50%"></div>` 配合实际 CSS 中的 `width: var(--progress)`
3. 完全的自定义样式，以及可以轻松的添加辅助丰富的动画和交互效果

譬如给 `g-progress` 添加一个过渡效果：

```js
.g-progress {
    // ...
    transition: width .2s linear;
}

```

这样，每次进度变化，都是一个动态的过渡过程：

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process4.gif)

或者，渐变前景色，修改 `background: #0f0` 为 `background: linear-gradient(90deg, #0f0, #0ff)`：

### 单标签使用渐变实现

当然，可以看到，我们上面使用的是两个标签的结构：

```
<div class="g-container">
    <div class="g-progress"></div>
</div>

```

抠门点，我们还可以仅仅利用一个标签去完成这个事情，主要借助了渐变去完成这个事情：

```js
<div class="g-progress"></div>
```

```js
.g-progress {
    width: 240px;
    height: 25px;
    border-radius: 25px;
    background: linear-gradient(90deg, #0f0, #0ff 70%, transparent 0);
    border: 1px solid #eee;
}

```

结果如下：

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process5.webp)

同样的，我们可以利用 HTML `style` 属性填写完整的 `background` 值传递实际百分比，当然，这里更推荐使用 CSS 自定义属性传值：

```js
<div class="g-progress" style="--progress: 50%"></div>
```

```js
.g-progress {
    background: linear-gradient(90deg, #0f0, #0ff var(--progress), transparent 0);
}

```

熟悉 CSS 的同学会发现一个目前这种方式的弊端，在于当修改 `--progress` 的值的时候，即便给 `.g-progress` 添加了 `transition`，也不会有过渡动画效果。

原因在于，CSS 中，渐变（诸如 `linear-gradinet`、`radial-gradient`、`conic-gradient`）都是不支持过渡变换的。

所以，在这里，为了实现动画效果，我们可以借助 CSS @property，改造下我们的代码：

```
<div class="g-progress" style="--progress: 70%"></div>

```

```js
@property --progress {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 0%;
}

.g-progress {
    margin: auto;
    width: 240px;
    height: 25px;
    border-radius: 25px;
    background: linear-gradient(90deg, #0f0, #0ff var(--progress), transparent 0);
    border: 1px solid #eee;
    transition: .3s --progress;
}

```

借助 CSS @property 的特性，我们在单标签下也是可以实现动画效果的：

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process6.gif)

CodePen Demo -- 单标签的进度条效果[2]

> 对 CSS @property 还不了解的，可以看看我的这篇文章 -- CSS @property，让不可能变可能[3]

## 圆弧形进度条

当然，进度条不可能只有直线型的。还有非常多其他类型的，下面我们首先来看看圆弧型的进度条。

在今天，我们可以使用 CSS 快速的创建圆弧形式的进度条，类似于这样：

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process7.webp)

核心就是使用角向渐变 `background: conic-gradient()`：

```
<div class="g-progress"></div>

```

```js
.g-progress {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: conic-gradient(#FFCDB2 0, #FFCDB2 25%, #B5838D 25%, #B5838D);
}

```

利用角向渐变 `background: conic-gradient()`，我们可以轻松实现这样一个饼图：

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process8.webp)

接下来就是镂空中间部分。

传统的想法是，在中间叠加一个圆，然而，这样做的一个极大的弊端在于，如果我们的背景不是纯色而是渐变色，就不适用了，譬如这样：

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process9.webp)

那么如何镂空中间，使得中间部分透明呢？这里我们可以巧妙的通过 `mask` 属性达到目的，镂空中间：

```js
.g-progress {
    background: conic-gradient(#FFCDB2 0, #FFCDB2 25%, #B5838D 25%, #B5838D);
  + mask: radial-gradient(transparent, transparent 50%, #000 50%, #000 0);
}

```

这样，我们就轻松的镂空了中间，即便背景不是纯色也无妨。

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process10.webp)

CodePen Demo - 角向渐变实现圆弧形进度条[4]

基于此拓展，还可以实现多色的圆弧型进度条：

```js
.g-progress {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    mask: radial-gradient(transparent, transparent 50%, #000 51%, #000 0);
    background:
        conic-gradient(
            #FFCDB2 0, #FFCDB2 25%,
            #B5838D 25%, #B5838D 50%,
            #673ab7 50%, #673ab7 90%,
            #ff5722 90.2%, #ff5722 100%
        );
}

```

当然，这个可能不像进度条，更类似于饼图？

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process11.webp)

### 角向渐变实现圆弧进度条的局限性

当然，这个方法有两个弊端。

1. 当然进度百分比不是类似于 0°、90°、180°、270°、360° 这类数字时，使用角向渐变时，不同颜色间的衔接处会有明显的锯齿。

看个例子 `conic-gradient(#FFCDB2 0, #FFCDB2 27%, #B5838D 27%, #B5838D)`：

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process12.webp)

遇到此类问题的解决方案是，在衔接处，适当留出一些渐变空间，我们简单的改造一下上述角向渐变代码：

```js
{
  - background: conic-gradient(#FFCDB2 0, #FFCDB2 27%, #B5838D 27%, #B5838D)`
  + background: conic-gradient(#FFCDB2 0, #FFCDB2 27%, #B5838D 27.2%, #B5838D)`
}

```

仔细看上面的代码，将从 `27%` 到 `27%` 的一个变化，改为了 从 `27%` 到 `27.2%`，这多出来的 `0.2%` 就是为了消除锯齿的，实际改变后的效果：

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process13.webp)

具体使用的使用，可以多调试选取既不会看出模糊，又能尽可能消除锯齿的一个范围幅度。

1. 对于开头和结尾需要圆形的圆弧进度条实现起来较为麻烦

还有一种情况，实际使用中，要求的是首尾带圆形的圆弧进度条，例如下图所示：

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process14.webp)

当然，这种情况当然进度条颜色是**纯色**也是可以解决的，我们通过在在首尾处叠加两个小圆圈即可实现这种效果。

如果进度条是渐变色的话，这种进度条则需要借助 SVG/Canvas 实现了。

上述完整的带圆角的圆弧进度条，你可以戳这里看完整源码 -- CodePen Demo -- 首尾为圆形的圆弧进度条[5]

## 球形进度条 wave

球形进度条也是比较常见的，类似于下面这种：

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

对于球形进度条，其实核心在于使用 CSS 实现中间部分的波浪效果。

这个技巧到今天应该已经被大伙熟知了，就不过多赘述，一图胜千言，可以使用滚动大圆的方式，类似于这样：

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

容器应用 `overflow: hidden`，就能得到这样的效果：

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

对这个技巧还不理解，可以猛击这篇文章：纯 CSS 实现波浪效果！[6]

应用这个技巧，只需要简单的封装，控制一下球形容器表示进度 0% - 100% 时的波浪的高度即可。我们就能得到从 0% - 100% 的动画效果。

完整的代码大概如下：

```js
<div class="container">
  <div class="wave-change"></div>
  <div class="wave"></div>
</div>
```

```js
.container {
    width: 200px;
    height: 200px;
    border: 5px solid rgb(118, 218, 255);
    border-radius: 50%;
    overflow: hidden;
}
.wave-change {
        position: absolute;
        width: 200px;
        height: 200px;
        left: 0;
        top: 0;
        animation: change 12s infinite linear;
      }
      .wave-change::before,
      .wave-change::after {
        content: '';
        position: absolute;
        width: 400px;
        height: 400px;
        top: 0;
        left: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        border-radius: 45% 47% 43% 46%;
        transform: translate(-50%, -70%) rotate(0);
        animation: rotate 7s linear infinite;
        z-index: 1;
      }
      .wave-change::after {
        border-radius: 47% 42% 46% 44%;
        background-color: rgba(255, 255, 255, 0.8);
        transform: translate(-50%, -70%) rotate(0);
        animation: rotate 9s linear -4s infinite;
        z-index: 2;
      }
.wave {
    position: relative;
    width: 200px;
    height: 200px;
    background-color: rgb(118, 218, 255);
    border-radius: 50%;
}

p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 36px;
    color: #000;
    z-index: 10;
}

@keyframes rotate {
   to {
        transform: translate(-50%, -70%) rotate(360deg);
    }
}
@keyframes change {
    from {
        top: 80px;
    }
    to {
        top: -120px;
    }
}

```

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

完整的代码示例，你可以戳这里：

- CodePen Demo -- Pure Css Wave Progress bar[7]
- CodePen Demo -- Pure Css Wave Progress bar Animation[8]

## 3D 进度条

嗯，下面这个 3D 进度条需要对 CSS 3D 有基本的掌握。

你可以先看看这篇文章 -- 奇思妙想 CSS 3D 动画 | 仅使用 CSS 能制作出多惊艳的动画？[9]

它主要是借助了一个 3D 立方体。接下来我们来实现一个立方体进度条~

首先，实现一个立方体，结构如下：

```js
<div class="demo-cube perspective">
  <ul class="cube">
    <li class="top"></li>
    <li class="bottom"></li>
    <li class="front"></li>
    <li class="back"></li>
    <li class="right"></li>
    <li class="left"></li>
  </ul>
</div>
```

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

我们可以把这个立方体想象成一个立体的进度条容器，通过控制 6 面的颜色，我们可以巧妙的得到一种 3D 进度条效果。

当然，其实我们不需要那么多面，4 个面即可，去掉左右，然后利用渐变修改一下立方体各个面的颜色，去掉 border，核心的 CSS 代码如下：

```js
.demo-cube {
  position: relative;

  .cube {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 100px;
    transform-style: preserve-3d;
    transform: translate(-50%, -50%) rotateX(-33.5deg);

    li {
      position: absolute;
      width: 300px;
      height: 100px;
      background: linear-gradient(90deg, rgba(156, 39, 176, .3), rgba(255, 34, 109, .8) 70%, rgba(255, 255, 255, .6) 70%, rgba(255, 255, 255, .6));
    }
    .top {
      transform: rotateX(90deg) translateZ(50px);
    }
    .bottom {
      transform: rotateX(-90deg) translateZ(50px);
    }
    .front {
      transform: translateZ(50px);
    }
    .back {
      transform: rotateX(-180deg) translateZ(50px);
    }
  }
}

```

我们就可以得到一个非常酷炫的 3D 进度条效果：

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

#### 利用 CSS Property 给 3D 进度条加上动画

当然，进度条嘛，它需要一个填充动画。由于我们使用的是渐变实现的进度条的进度，需要去控制其中的颜色百分比变化。

而正常而言，CSS 是不支持渐变的动画的，不过这也难不倒我们，因为我们可以使用 CSS @Property 。

简单改造一下代码：

```js
@property --per {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 0%;
}

.demo-cube .cube {
  .top,
  .front,
  .bottom,
  .back {
    background: linear-gradient(90deg, rgba(255, 217, 34, .6), rgba(255, 34, 109, .8) var(--per), rgba(255, 34, 109, .1) var(--per), rgba(255, 34, 109, .1));
    animation: perChange 6s infinite;
  }
}

@keyframes perChange {
  0% {
    --per: 0%;
  }
  90%,
  to {
    --per: 80%;
  }
}

```

这样，我们就实现了一个会动的 3D 进度条，只需要控制 `--per` CSS 自定义属性即可，效果如下：

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

> 对于 CSS @Property 不算很了解的，可以看看作者的这篇文章 -- CSS @property，让不可能变可能[10]，它的出现，让 CSS 极大的提升了制作各种动画的能力。

上述的完整代码，你可以猛击这里：CSS 灵感 -- 3D 立方体进度条[11]

## 扩展延伸

本文从简到繁介绍了使用 HTML/CSS 逐步构建进度条的方式，并且逐渐加深了难度。

当然，随着难度的提升，得到的是更为酷炫的进度条。

基于上述的方法介绍，基本可以演化出各种我们需要的进度条。譬如基于上述的方法，可以实现一个简单的电池充电动画：

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process15.gif)

当然，CSS 千变万化，进度条的种类肯定也不仅仅局限于上述的几类。譬如我们可以利用滤镜实现的仿华为手机的充电动画，也是一种进度条的呈现方式，也是能够使用纯 CSS 实现的：

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process16.gif)

> 上述效果的完整实现可以戳 -- 巧用 CSS 实现酷炫的充电动画[12]

又或者，我们可以在进度条的纹理上做文章：

![图片](https://alianck.oss-cn-beijing.aliyuncs.com/process17.webp)

效果来源于 CodePen -- Bars By Lucagaz[13]。

总而言之，CSS 美好世界值得我们去探索。

## 最后

好了，本文到此结束，希望本文对你有所帮助 :)
