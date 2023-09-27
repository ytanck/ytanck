---
title: JS异步编程
categories: 前端
tags: JavaScript
---

## JS异步发展历程
知其然知其所以然，首先了解三个概念：

**1.什么是同步？**

所谓同步，就是在发出一个"调用"时，在没有得到结果之前，该“调用”就不返回。但是一旦调用返回，就得到返回值了。换句话说，就是由“调用者”主动等待这个“调用”的结果。此调用执行完之前，阻塞之后的代码执行。

**2.什么是异步？**

"调用"在发出之后，这个调用就直接返回了，所以没有返回结果。换句话说，当一个异步过程调用发出后，调用者不会立刻得到结果。而是在"调用"发出后，"被调用者"通过状态、通知来通知调用者，或通过回调函数处理这个调用。异步调用发出后，不影响后面代码的执行。

**3.JavaScript 中为什么需要异步？**

首先我们知道JavaScript是单线程的(即使新增了webworker，但是本质上JS还是单线程)。同步代码意味着什么呢？意味着有可能会阻塞，当我们有一个任务需要时间较长时，如果使用同步方式，那么就会阻塞之后的代码执行。而异步则不会，我们不会等待异步代码的之后，继续执行异步任务之后的代码。



概念了解完了，我们就要进入今天的正题了。首先大家思考一下：平时在工作中，主要使用了哪些异步解决方案，这些异步方案有什么优缺点？



异步最早的解决方案是回调函数，如事件的回调，setInterval/setTimeout中的回调。但是回调函数有一个很常见的问题，就是回调地狱的问题(稍后会举例说明);

为了解决回调地狱的问题，社区提出了Promise解决方案，ES6将其写进了语言标准。Promise一定程度上解决了回调地狱的问题，但是Promise也存在一些问题，如错误不能被try catch，而且使用Promise的链式调用，其实并没有从根本上解决回调地狱的问题，只是换了一种写法。

ES6中引入 Generator 函数，Generator是一种异步编程解决方案，Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权，Generator 函数可以看出是异步任务的容器，需要暂停的地方，都用yield语句注明。但是 Generator 使用起来较为复杂。

ES7又提出了新的异步解决方案:async/await，async是 Generator 函数的语法糖，async/await 使得异步代码看起来像同步代码，异步编程发展的目标就是让异步逻辑的代码看起来像同步一样。

{% tabs test1 %}

回调函数 ---> Promise ---> Generator ---> async/await.

{% endtabs %}

#### 1.callback

```js
//node读取文件
fs.readFile(xxx, 'utf-8', function(err, data) {
    //code
});
```
回调函数的使用场景(包括但不限于):

- 事件回调
- Node API
- setTimeout/setInterval中的回调函数
- ajax 请求

回调函数的优点: 简单。

回调函数的缺点：

异步回调嵌套会导致代码难以维护，并且不方便统一处理错误，不能 try catch 和 回调地狱(如先读取A文本内容，再根据A文本内容读取B再根据B的内容读取C...)。
```js
fs.readFile(A, 'utf-8', function(err, data) {
    fs.readFile(B, 'utf-8', function(err, data) {
        fs.readFile(C, 'utf-8', function(err, data) {
            fs.readFile(D, 'utf-8', function(err, data) {
                //....
            });
        });
    });
});
```
### 2.Promise
Promise 一定程度上解决了回调地狱的问题，Promise 最早由社区提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了Promise对象。

那么我们看看Promise是如何解决回调地狱问题的，仍然以上文的readFile 为例(先读取A文本内容，再根据A文本内容读取B再根据B的内容读取C)。
```js
function read(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf8', (err, data) => {
            if(err) reject(err);
            resolve(data);
        });
    });
}
read(A).then(data => {
    return read(B);
}).then(data => {
    return read(C);
}).then(data => {
    return read(D);
}).catch(reason => {
    console.log(reason);
});
```
Promise 的优点:

- 一旦状态改变，就不会再变，任何时候都可以得到这个结果
- 可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数

缺点:

- 无法取消 Promise
- 当处于pending状态时，无法得知目前进展到哪一个阶段
- 错误不能被 try catch
假设有这样一个需求：读取A,B,C三个文件内容，都读取成功后，再输出最终的结果。在Promise之前，我们一般可以借助发布订阅模式去实现:

```js
let pubsub = {
    arry: [],
    emit() {
        this.arry.forEach(fn => fn());
    },
    on(fn) {
        this.arry.push(fn);
    }
}

let data = [];
pubsub.on(() => {
    if(data.length === 3) {
        console.log(data);
    }
});
fs.readFile(A, 'utf-8', (err, value) => {
    data.push(value);
    pubsub.emit();
});
fs.readFile(B, 'utf-8', (err, value) => {
    data.push(value);
    pubsub.emit();
});
fs.readFile(C, 'utf-8', (err, value) => {
    data.push(value);
    pubsub.emit();
});
```
Promise给我们提供了 Promise.all 的方法，对于这个需求，我们可以使用 Promise.all 来实现。
```js
/**
 * 将 fs.readFile 包装成promise接口
 */
function read(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf8', (err, data) => {
            if(err) reject(err);
            resolve(data);
        });
    });
}

/**
 * 使用 Promise
 * 
 * 通过 Promise.all 可以实现多个异步并行执行，同一时刻获取最终结果的问题
 */
Promise.all([
    read(A),
    read(B),
    read(C)
]).then(data => {
    console.log(data);
}).catch(err => console.log(err));
```
### 3.Generator
Generator 函数是 ES6 提供的一种异步编程解决方案，整个 Generator 函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用 yield 语句注明。

Generator 函数一般配合 yield 或 Promise 使用。Generator函数返回的是迭代器。对生成器和迭代器不了解的同学，请自行补习下基础。下面我们看一下 Generator 的简单使用:
```js
function* gen() {
    let a = yield 111;
    console.log(a);
    let b = yield 222;
    console.log(b);
    let c = yield 333;
    console.log(c);
    let d = yield 444;
    console.log(d);
}
let t = gen();
//next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值
t.next(1); //第一次调用next函数时，传递的参数无效
t.next(2); //a输出2;
t.next(3); //b输出3; 
t.next(4); //c输出4;
t.next(5); //d输出5;
```
为了让大家更好的理解上面代码是如何执行的，我画了一张图，分别对应每一次的next方法调用:

仍然以上文的 readFile (先读取A文本内容，再根据A文本内容读取B再根据B的内容读取C)为例，使用 Generator + co库来实现:
```js
const fs = require('fs');
const co = require('co');
const bluebird = require('bluebird');
const readFile = bluebird.promisify(fs.readFile);

function* read() {
    yield readFile(A, 'utf-8');
    yield readFile(B, 'utf-8');
    yield readFile(C, 'utf-8');
    //....
}
co(read()).then(data => {
    //code
}).catch(err => {
    //code
});
```
Generator的缺点大约不用我说了，除非是找虐，不然一般不会直接使用 Generator 来解决异步的(当然也不排除是因为我不熟练)~~

### 4.async/await
ES7中引入了 async/await 概念。async 其实是一个语法糖，它的实现就是将 Generator函数和自动执行器（co），包装在一个函数中。

async/await 的优点是代码清晰，不用像 Promise 写很多 then 链，就可以处理回调地狱的问题。并且错误可以被try catch。

仍然以上文的readFile (先读取A文本内容，再根据A文本内容读取B再根据B的内容读取C) 为例，使用 async/await 来实现:

```js
const fs = require('fs');
const bluebird = require('bluebird');
const readFile = bluebird.promisify(fs.readFile);


async function read() {
    await readFile(A, 'utf-8');
    await readFile(B, 'utf-8');
    await readFile(C, 'utf-8');
    //code
}

read().then((data) => {
    //code
}).catch(err => {
    //code
});
```
使用 async/await 实现此需求：读取A,B,C三个文件内容，都读取成功后，再输出最终的结果。
```js
function read(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf8', (err, data) => {
            if(err) reject(err);
            resolve(data);
        });
    });
}

async function readAsync() {
    let data = await Promise.all([
        read(A),
        read(B),
        read(C)
    ]);
    return data;
}

readAsync().then(data => {
    console.log(data);
});
```
所以JS的异步发展史，可以认为是从 callback -> promise -> generator -> async/await。async/await 使得异步代码看起来像同步代码，异步编程发展的目标就是让异步逻辑的代码看起来像同步一样。

因本人水平有限，文中内容未必百分百正确，如有不对的地方，请给我留言，谢谢。