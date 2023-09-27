---
title: 什么是 Proxy
categories: 前端
tags: JavaScript
---

## 什么是 Proxy

通常，当谈到JavaScript语言时，我们讨论的是ES6标准提供的新特性，本文也不例外。 我们将讨论JavaScript代理以及它们的作用，但在我们深入研究之前，我们先来看一下Proxy的定义是什么。

MDN上的定义是：代理对象是用于定义基本操作的自定义行为（例如，属性查找，赋值，枚举，函数调用等）。

换句话说，我们可以说代理对象是我们的目标对象的包装器，我们可以在其中操纵其属性并阻止对它的直接访问。 你可能会发现将它们应用到实际代码中很困难，我鼓励你仔细阅读这个概念，它可能会改变你的观点。

### 术语
handler

包含陷阱（traps）的占位符对象。

traps

提供属性访问的方法。这类似于操作系统中捕获器的概念。

target

代理虚拟化的对象。(由代理对象包装和操作的实际对象)

在本文中，我将为 get 和 set 陷阱 提供简单的用例，考虑到最后，我们将看到如何使用它们并包含更复杂的功能，如API。

### 语法和用例

```js
let p = new Proxy(target, handler);
```
将目标和处理程序传递给Proxy构造函数，这样就创建了一个proxy对象。现在，让我们看看如何利用它。为了更清楚地看出Proxy的好处，首先，我们需要编写一些没有它的代码。

想象一下，我们有一个带有几个属性的用户对象，如果属性存在，我们想要打印用户信息，如果不存在，则抛出异常。在不使用代理对象时，判断属性值是否存在的代码也放在了打印用户信息的函数，即 printUser 中(这并不是我们所希望的)，如下demo所示：

```js
let user = {
    name: 'John',
    surname: 'Doe'
};

let printUser = (property) => {
    let value = user[property];
    if (!value) {
        throw new Error(`The property [${property}] does not exist`);
    } else {
        console.log(`The user ${property} is ${value}`);
    }
}

printUser('name'); // 输出: 'The user name is John'
printUser('email'); // 抛出错误: The property [email] does not exist
```
### get
通过查看上面的代码，你会发现：将条件和异常移到其他地方，而printUser中仅关注显示用户信息的实际逻辑会更好。这是我们可以使用代理对象的地方，让我们更新一下这个例子。
```js
let user = {
    name: 'John',
    surname: 'Doe'
};

let proxy = new Proxy(user, {
    get(target, property) {
        let value = target[property];
        if (!value) {
            throw new Error(`The property [${property}] does not exist`);
        }
        return value;
    }
});

let printUser = (property) => {
    console.log(`The user ${property} is ${proxy[property]}`);
};

printUser('name'); // 输出： 'The user name is John'
printUser('email'); // 抛出错误: The property [email] does not exist
```
在上面的示例中，我们包装了 user 对象，并设置了一个 get 方法。 此方法充当拦截器，在返回值之前，会首先对属性值进行检查，如果不存在，则抛出异常。

输出与第一种情况相同，但此时 printUser 函数专注于逻辑，只处理消息。

### set
代理可能有用的另一个例子是属性值验证。在这种情况下，我们需要使用 set 方法，并在其中进行验证。例如，当我们需要确保目标类型时，这是一个非常有用的钩子。我们来看一下实际使用：
```js
let user = new Proxy({}, {
    set(target, property, value) {
        if (property === 'name' && Object.prototype.toString.call(value) !== '[object String]') { // 确保是 string 类型
            throw new Error(`The value for [${property}] must be a string`);
        };
        target[property] = value;
    }
});

user.name = 1; // 抛出错误: The value for [name] must be a string
```
这些是相当简单的用例，以下场景，proxy均可以派上用场：

- 格式化
- 价值和类型修正
- 数据绑定
- 调试
- ...
现在是时候创建一个更复杂的用例了。

### 具有代理的API - 更复杂的示例
通过使用简单用例中的知识，我们可以创建一个API包装器，以便在我们的应用程序中使用。 当前只支持 get 和 post 请求，但它可以很容易地扩展。代码如下所示。
```js
const api = new Proxy({}, {
    get(target, key, context) {
        return target[key] || ['get', 'post'].reduce((acc, key) => {
            acc[key] = (config, data) => {

                if (!config && !config.url || config.url === '') throw new Error('Url cannot be empty.');
                let isPost = key === 'post';

                if (isPost && !data) throw new Error('Please provide data in JSON format when using POST request.');

                config.headers = isPost ? Object.assign(config.headers || {}, { 'content-type': 'application/json;chartset=utf8' }) :
                    config.headers;

                return new Promise((resolve, reject) => {
                    let xhr = new XMLHttpRequest();
                    xhr.open(key, config.url);
                    if (config.headers) {
                        Object.keys(config.headers).forEach((header) => {
                            xhr.setRequestHeader(header, config.headers[header]);
                        });
                    }
                    xhr.onload = () => (xhr.status === 200 ? resolve : reject)(xhr);
                    xhr.onerror = () => reject(xhr);
                    xhr.send(isPost ? JSON.stringify(data) : null);
                });
            };
            return acc;
        }, target)[key];
    },
    set() {
        throw new Error('API methods are readonly');
    },
    deleteProperty() {
        throw new Error('API methods cannot be deleted!');
    }
});
```
让我们解释一下简单实现，set 和 deleteProperty。 我们添加了一个保护级别，并确保每当有人意外或无意地尝试为任何API属性设置新值时，都会抛出异常。

每次尝试删除属性时都会调用 deleteProperty 方法。可以确保没有人可以从我们的代理(即此处的 api)中删除任何属性，因为通常我们都不想丢失API方法。

get 在这里很有趣，它做了几件事。target 是一个空对象，get 方法将在第一次有人使用 api 时创建所有方法(如当前的 get 和 post请求)，在 reduce 回调中，我们根据提供的配置执行API规范所需的验证和检查。在此示例中，我们不允许空URL和发布请求而不提供数据。这些检查可以扩展和修改，但重要的是我们只能在这一个地方集中处理。

reduce 仅在第一次API调用时完成，之后都会跳过整个 reduce 进程，get 只会执行默认行为并返回属性值，即API处理程序。每个处理程序返回一个Promise对象，负责创建请求并调用服务。

使用：
```js
api.get({
    url: 'my-url'
}).then((xhr) => {
    alert('Success');
}, (xhr) => {
    alert('Fail');
});
```
```
delete api.get; //throw new Error('API methods cannot be deleted!'); 
```
结论

当您需要对数据进行更多控制时，代理可以派上用场。你可以根据受控规则扩展或拒绝对原始数据的访问，从而监视对象并确保正确行为。