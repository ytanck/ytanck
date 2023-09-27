---
title: 大厂JS必考手写题
date: 2023-01-01 09:45:39
categories: 
 - [前端]
tags: 
 - JavaScript
 - 面试
---

## 篇一

🎄 前言

本文主要总结了 2021 年前端提前批和秋招所考察的手写题，题目来源于牛客网前端面经区，统计时间自 3 月初至 10 月底，面经来源于阿里、腾讯、百度、字节、美团、京东、快手、拼多多等 15 家公司，并做了简单的频次划分。

- ⭐⭐⭐⭐⭐: 在 15 家公司面试中出现 10+
- ⭐⭐⭐⭐：在 15 家公式面试中出现 5-10
- ⭐⭐⭐：在 15 家公司面试中出现 3-5
- 无星：出现 1-2

题目解析一部分来源于小包的编写，另一部分如果我感觉题目扩展开来更好的话，我就选取部分大佬的博客链接。

## 🌟 promise

### 实现 promise

考察频率: (⭐⭐⭐⭐⭐)

参考代码[1]

### 实现 promise.all

考察频率: (⭐⭐⭐⭐⭐)

```js
function PromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      throw new TypeError("promises must be an array");
    }
    let result = [];
    let count = 0;
    promises.forEach((promise, index) => {
      promise.then(
        (res) => {
          result[index] = res;
          count++;
          count === promises.length && resolve(result);
        },
        (err) => {
          reject(err);
        }
      );
    });
  });
}

复制代码;
```

### 实现 promise.finally

考察频率: (⭐⭐⭐⭐⭐)

```js
Promise.prototype.finally = function (cb) {
  return this.then(
    function (value) {
      return Promise.resolve(cb()).then(function () {
        return value;
      });
    },
    function (err) {
      return Promise.resolve(cb()).then(function () {
        throw err;
      });
    }
  );
};

复制代码;
```

### 实现 promise.allSettled

考察频率: (⭐⭐⭐⭐)

```js
function allSettled(promises) {
  if (promises.length === 0) return Promise.resolve([]);

  const _promises = promises.map((item) =>
    item instanceof Promise ? item : Promise.resolve(item)
  );

  return new Promise((resolve, reject) => {
    const result = [];
    let unSettledPromiseCount = _promises.length;

    _promises.forEach((promise, index) => {
      promise.then(
        (value) => {
          result[index] = {
            status: "fulfilled",
            value,
          };

          unSettledPromiseCount -= 1;
          // resolve after all are settled
          if (unSettledPromiseCount === 0) {
            resolve(result);
          }
        },
        (reason) => {
          result[index] = {
            status: "rejected",
            reason,
          };

          unSettledPromiseCount -= 1;
          // resolve after all are settled
          if (unSettledPromiseCount === 0) {
            resolve(result);
          }
        }
      );
    });
  });
}
复制代码;
```

### 实现 promise.race

考察频率: (⭐⭐⭐)

```js
Promise.race = function (promiseArr) {
  return new Promise((resolve, reject) => {
    promiseArr.forEach((p) => {
      Promise.resolve(p).then(
        (val) => {
          resolve(val);
        },
        (err) => {
          rejecte(err);
        }
      );
    });
  });
};
复制代码;
```

### 来说一下如何串行执行多个 Promise

参考代码[2]

### promise.any

```js
Promise.any = function (promiseArr) {
  let index = 0;
  return new Promise((resolve, reject) => {
    if (promiseArr.length === 0) return;
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then(
        (val) => {
          resolve(val);
        },
        (err) => {
          index++;
          if (index === promiseArr.length) {
            reject(new AggregateError("All promises were rejected"));
          }
        }
      );
    });
  });
};

复制代码;
```

### resolve

```js
Promise.resolve = function (value) {
  if (value instanceof Promise) {
    return value;
  }
  return new Promise((resolve) => resolve(value));
};

复制代码;
```

### reject

```js
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => reject(reason));
};
复制代码;
```

## 🐳 Array 篇

### 数组去重

考察频率: (⭐⭐⭐⭐⭐)

#### 使用双重 `for` 和 `splice`

```js
function unique(arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] == arr[j]) {
        //第一个等同于第二个，splice方法删除第二个
        arr.splice(j, 1);
        // 删除后注意回调j
        j--;
      }
    }
  }
  return arr;
}
复制代码;
```

#### 使用 `indexOf` 或 `includes` 加新数组

```js
//使用indexof
function unique(arr) {
  var uniqueArr = []; // 新数组
  for (let i = 0; i < arr.length; i++) {
    if (uniqueArr.indexOf(arr[i]) === -1) {
      //indexof返回-1表示在新数组中不存在该元素
      uniqueArr.push(arr[i]); //是新数组里没有的元素就push入
    }
  }
  return uniqueArr;
}
// 使用includes
function unique(arr) {
  var uniqueArr = [];
  for (let i = 0; i < arr.length; i++) {
    //includes 检测数组是否有某个值
    if (!uniqueArr.includes(arr[i])) {
      uniqueArr.push(arr[i]); //
    }
  }
  return uniqueArr;
}
复制代码;
```

#### `sort` 排序后，使用快慢指针的思想

```js
function unique(arr) {
  arr.sort((a, b) => a - b);
  var slow = 1,
    fast = 1;
  while (fast < arr.length) {
    if (arr[fast] != arr[fast - 1]) {
      arr[slow++] = arr[fast];
    }
    ++fast;
  }
  arr.length = slow;
  return arr;
}
复制代码;
```

`sort` 方法用于从小到大排序(返回一个新数组)，其参数中不带以上回调函数就会在两位数及以上时出现排序错误(如果省略，元素按照转换为的字符串的各个字符的 `Unicode` 位点进行排序。两位数会变为长度为二的字符串来计算)。

#### `ES6` 提供的 `Set` 去重

```js
function unique(arr) {
  const result = new Set(arr);
  return [...result];
  //使用扩展运算符将Set数据结构转为数组
}
复制代码;
```

`Set` 中的元素只会出现一次，即 `Set` 中的元素是唯一的。

#### 使用哈希表存储元素是否出现(`ES6` 提供的 `map`)

```js
function unique(arr) {
  let map = new Map();
  let uniqueArr = new Array(); // 数组用于返回结果
  for (let i = 0; i < arr.length; i++) {
    if (map.has(arr[i])) {
      // 如果有该key值
      map.set(arr[i], true);
    } else {
      map.set(arr[i], false); // 如果没有该key值
      uniqueArr.push(arr[i]);
    }
  }
  return uniqueArr;
}
复制代码;
```

`map` 对象保存键值对，与对象类似。但 `map` 的键可以是任意类型，对象的键只能是字符串类型。

如果数组中只有数字也可以使用普通对象作为哈希表。

#### `filter` 配合 `indexOf`

```js
function unique(arr) {
  return arr.filter(function (item, index, arr) {
    //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
    //不是那么就证明是重复项，就舍弃
    return arr.indexOf(item) === index;
  });
}
复制代码;
```

这里有可能存在疑问，我来举个例子：

```js
const arr = [1, 1, 2, 1, 3];
arr.indexOf(arr[0]) === 0; // 1 的第一次出现
arr.indexOf(arr[1]) !== 1; // 说明前面曾经出现过1
复制代码;
```

#### `reduce` 配合 `includes`

```js
function unique(arr) {
  let uniqueArr = arr.reduce((acc, cur) => {
    if (!acc.includes(cur)) {
      acc.push(cur);
    }
    return acc;
  }, []); // []作为回调函数的第一个参数的初始值
  return uniqueArr;
}
复制代码;
```

### 数组扁平化

考察频率: (⭐⭐⭐)

参考代码[3]

### forEach

考察频率: (⭐⭐⭐)

```js
Array.prototype.myForEach = function (callbackFn) {
  // 判断this是否合法
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'myForEach' of null");
  }
  // 判断callbackFn是否合法
  if (Object.prototype.toString.call(callbackFn) !== "[object Function]") {
    throw new TypeError(callbackFn + " is not a function");
  }
  // 取到执行方法的数组对象和传入的this对象
  var _arr = this,
    thisArg = arguments[1] || window;
  for (var i = 0; i < _arr.length; i++) {
    // 执行回调函数
    callbackFn.call(thisArg, _arr[i], i, _arr);
  }
};

复制代码;
```

### reduce

考察频率: (⭐⭐⭐)

```js
Array.prototype.myReduce = function (callbackFn) {
  var _arr = this,
    accumulator = arguments[1];
  var i = 0;
  // 判断是否传入初始值
  if (accumulator === undefined) {
    // 没有初始值的空数组调用reduce会报错
    if (_arr.length === 0) {
      throw new Error("initVal and Array.length>0 need one");
    }
    // 初始值赋值为数组第一个元素
    accumulator = _arr[i];
    i++;
  }
  for (; i < _arr.length; i++) {
    // 计算结果赋值给初始值
    accumulator = callbackFn(accumulator, _arr[i], i, _arr);
  }
  return accumulator;
};

复制代码;
```

### map

```js
Array.prototype.myMap = function (callbackFn) {
  var _arr = this,
    thisArg = arguments[1] || window,
    res = [];
  for (var i = 0; i < _arr.length; i++) {
    // 存储运算结果
    res.push(callbackFn.call(thisArg, _arr[i], i, _arr));
  }
  return res;
};

复制代码;
```

### filter

```js
Array.prototype.myFilter = function (callbackFn) {
  var _arr = this,
    thisArg = arguments[1] || window,
    res = [];
  for (var i = 0; i < _arr.length; i++) {
    // 回调函数执行为true
    if (callbackFn.call(thisArg, _arr[i], i, _arr)) {
      res.push(_arr[i]);
    }
  }
  return res;
};
复制代码;
```

### every

```js
Array.prototype.myEvery = function (callbackFn) {
  var _arr = this,
    thisArg = arguments[1] || window;
  // 开始标识值为true
  // 遇到回调返回false，直接返回false
  // 如果循环执行完毕，意味着所有回调返回值为true，最终结果为true
  var flag = true;
  for (var i = 0; i < _arr.length; i++) {
    // 回调函数执行为false，函数中断
    if (!callbackFn.call(thisArg, _arr[i], i, _arr)) {
      return false;
    }
  }
  return flag;
};
复制代码;
```

### some

```js
Array.prototype.mySome = function (callbackFn) {
  var _arr = this,
    thisArg = arguments[1] || window;
  // 开始标识值为false
  // 遇到回调返回true，直接返回true
  // 如果循环执行完毕，意味着所有回调返回值为false，最终结果为false
  var flag = false;
  for (var i = 0; i < _arr.length; i++) {
    // 回调函数执行为false，函数中断
    if (callbackFn.call(thisArg, _arr[i], i, _arr)) {
      return true;
    }
  }
  return flag;
};
复制代码;
```

### find/findIndex

```js
Array.prototype.myFind = function (callbackFn) {
  var _arr = this,
    thisArg = arguments[1] || window;
  // 遇到回调返回true，直接返回该数组元素
  // 如果循环执行完毕，意味着所有回调返回值为false，最终结果为undefined
  for (var i = 0; i < _arr.length; i++) {
    // 回调函数执行为false，函数中断
    if (callbackFn.call(thisArg, _arr[i], i, _arr)) {
      return _arr[i];
    }
  }
  return undefined;
};
复制代码;
```

### indexOf

```js
function indexOf(findVal, beginIndex = 0) {
  if (this.length < 1 || beginIndex > findVal.length) {
    return -1;
  }
  if (!findVal) {
    return 0;
  }
  beginIndex = beginIndex <= 0 ? 0 : beginIndex;
  for (let i = beginIndex; i < this.length; i++) {
    if (this[i] == findVal) return i;
  }
  return -1;
}

复制代码;
```

### 实现 sort

参考代码[4]

## 🌊 防抖节流

### 实现防抖函数 debounce

考察频率: (⭐⭐⭐⭐⭐)

```js
function debounce(func, wait, immediate) {
  var timeout, result;

  var debounced = function () {
    var context = this;
    var args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) result = func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        result = func.apply(context, args);
      }, wait);
    }
    return result;
  };

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}
复制代码;
```

### 实现节流函数 throttle

考察频率: (⭐⭐⭐⭐⭐)

```js
// 第四版
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function () {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
  };
  return throttled;
}

复制代码;
```

## ⛲ Object 篇

### 能不能写一个完整的深拷贝

考察频率: (⭐⭐⭐⭐⭐)

```js
const getType = (obj) => Object.prototype.toString.call(obj);

const isObject = (target) =>
  (typeof target === "object" || typeof target === "function") &&
  target !== null;

const canTraverse = {
  "[object Map]": true,
  "[object Set]": true,
  "[object Array]": true,
  "[object Object]": true,
  "[object Arguments]": true,
};
const mapTag = "[object Map]";
const setTag = "[object Set]";
const boolTag = "[object Boolean]";
const numberTag = "[object Number]";
const stringTag = "[object String]";
const symbolTag = "[object Symbol]";
const dateTag = "[object Date]";
const errorTag = "[object Error]";
const regexpTag = "[object RegExp]";
const funcTag = "[object Function]";

const handleRegExp = (target) => {
  const { source, flags } = target;
  return new target.constructor(source, flags);
};

const handleFunc = (func) => {
  // 箭头函数直接返回自身
  if (!func.prototype) return func;
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();
  // 分别匹配 函数参数 和 函数体
  const param = paramReg.exec(funcString);
  const body = bodyReg.exec(funcString);
  if (!body) return null;
  if (param) {
    const paramArr = param[0].split(",");
    return new Function(...paramArr, body[0]);
  } else {
    return new Function(body[0]);
  }
};

const handleNotTraverse = (target, tag) => {
  const Ctor = target.constructor;
  switch (tag) {
    case boolTag:
      return new Object(Boolean.prototype.valueOf.call(target));
    case numberTag:
      return new Object(Number.prototype.valueOf.call(target));
    case stringTag:
      return new Object(String.prototype.valueOf.call(target));
    case symbolTag:
      return new Object(Symbol.prototype.valueOf.call(target));
    case errorTag:
    case dateTag:
      return new Ctor(target);
    case regexpTag:
      return handleRegExp(target);
    case funcTag:
      return handleFunc(target);
    default:
      return new Ctor(target);
  }
};

const deepClone = (target, map = new WeakMap()) => {
  if (!isObject(target)) return target;
  let type = getType(target);
  let cloneTarget;
  if (!canTraverse[type]) {
    // 处理不能遍历的对象
    return handleNotTraverse(target, type);
  } else {
    // 这波操作相当关键，可以保证对象的原型不丢失！
    let ctor = target.constructor;
    cloneTarget = new ctor();
  }

  if (map.get(target)) return target;
  map.set(target, true);

  if (type === mapTag) {
    //处理Map
    target.forEach((item, key) => {
      cloneTarget.set(deepClone(key, map), deepClone(item, map));
    });
  }

  if (type === setTag) {
    //处理Set
    target.forEach((item) => {
      cloneTarget.add(deepClone(item, map));
    });
  }

  // 处理数组和对象
  for (let prop in target) {
    if (target.hasOwnProperty(prop)) {
      cloneTarget[prop] = deepClone(target[prop], map);
    }
  }
  return cloneTarget;
};

复制代码;
```

参考博客[5]

### 实现 new

考察频率: (⭐⭐⭐⭐)

```js
function createObject(Con) {
  // 创建新对象obj
  // var obj = {};也可以
  var obj = Object.create(null);

  // 将obj.__proto__ -> 构造函数原型
  // (不推荐)obj.__proto__ = Con.prototype
  Object.setPrototypeOf(obj, Con.prototype);

  // 执行构造函数，并接受构造函数返回值
  const ret = Con.apply(obj, [].slice.call(arguments, 1));

  // 若构造函数返回值为对象，直接返回该对象
  // 否则返回obj
  return typeof ret === "object" ? ret : obj;
}
复制代码;
```

### 继承

考察频率: (⭐⭐⭐⭐)

#### 原型链继承

#### 借用构造函数(经典继承)

#### 组合继承

#### 原型式继承

#### 寄生式继承

#### 寄生组合式继承

#### Class 实现继承(补充一下)

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}
class Dog extends Animal {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
}
复制代码;
```

参考代码[6]

### 实现 object.create

```js
function newCreate(proto, propertiesObject) {
  if (typeof proto !== "object" && typeof proto !== "function") {
    throw TypeError("Object prototype may only be an Object: " + proto);
  }
  function F() {}
  F.prototype = proto;
  const o = new F();

  if (propertiesObject !== undefined) {
    Object.keys(propertiesObject).forEach((prop) => {
      let desc = propertiesObject[prop];
      if (typeof desc !== "object" || desc === null) {
        throw TypeError("Object prorotype may only be an Object: " + desc);
      } else {
        Object.defineProperty(o, prop, desc);
      }
    });
  }

  return o;
}
复制代码;
```

## 🚂 Function 篇

### call

考察频率: (⭐⭐⭐⭐)

```js
Function.prototype.myCall = function (thisArg) {
  thisArg = thisArg || window;
  thisArg.func = this;
  const args = [];
  for (let i = 1; i < arguments.length; i++) {
    args.push("arguments[" + i + "]");
  }
  const result = eval("thisArg.func(" + args + ")");
  delete thisArg.func;
  return result;
};
复制代码;
```

### bind

考察频率: (⭐⭐⭐⭐)

```js
Function.prototype.sx_bind = function (obj, ...args) {
  obj = obj || window;

  const fn = Symbol();
  obj[fn] = this;
  const _this = this;

  const res = function (...innerArgs) {
    console.log(this, _this);
    if (this instanceof _this) {
      this[fn] = _this;
      this[fn](...[...args, ...innerArgs]);
      delete this[fn];
    } else {
      obj[fn](...[...args, ...innerArgs]);
      delete obj[fn];
    }
  };
  res.prototype = Object.create(this.prototype);
  return res;
};
复制代码;
```

### apply

考察频率: (⭐⭐⭐⭐)

```js
Function.prototype.myApply = function (thisArg, arr) {
  thisArg = thisArg || window;
  thisArg.func = this;
  const args = [];
  for (let i = 0; i < arr.length; i++) {
    args.push("arr[" + i + "]");
  }
  const result = eval("thisArg.func(" + args + ")");
  delete thisArg.func;
  return result;
};
复制代码;
```

### 实现柯里化

考察频率: (⭐⭐⭐)

参考代码[7]

### 实现链式调用

参考代码[8]

### 偏函数

参考代码[9]

## 🌍 ajax 与 jsonp

考察频率: (⭐⭐⭐)

### 实现 ajax

```js
function ajax({ url = null, method = "GET", dataType = "JSON", async = true }) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, async);
    xhr.responseType = dataType;
    xhr.onreadystatechange = () => {
      if (!/^[23]\d{2}$/.test(xhr.status)) return;
      if (xhr.readyState === 4) {
        let result = xhr.responseText;
        resolve(result);
      }
    };
    xhr.onerror = (err) => {
      reject(err);
    };
    xhr.send();
  });
}
复制代码;
```

### 实现 jsonp

```js
const jsonp = ({ url, params, callbackName }) => {
  const generateUrl = () => {
    let dataSrc = "";
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        dataSrc += `${key}=${params[key]}&`;
      }
    }
    dataSrc += `callback=${callbackName}`;
    return `${url}?${dataSrc}`;
  };
  return new Promise((resolve, reject) => {
    const scriptEle = document.createElement("script");
    scriptEle.src = generateUrl();
    document.body.appendChild(scriptEle);
    window[callbackName] = (data) => {
      resolve(data);
      document.removeChild(scriptEle);
    };
  });
};
复制代码;
```

## 🛫 ES6 篇

### 实现 set

```js
class Set {
  constructor() {
    this.items = {};
    this.size = 0;
  }

  has(element) {
    return element in this.items;
  }

  add(element) {
    if (!this.has(element)) {
      this.items[element] = element;
      this.size++;
    }
    return this;
  }

  delete(element) {
    if (this.has(element)) {
      delete this.items[element];
      this.size--;
    }
    return this;
  }

  clear() {
    this.items = {};
    this.size = 0;
  }

  values() {
    let values = [];
    for (let key in this.items) {
      if (this.items.hasOwnProperty(key)) {
        values.push(key);
      }
    }
    return values;
  }
}
复制代码;
```

### 实现 map

```js
function defaultToString(key) {
  if (key === null) {
    return "NULL";
  } else if (key === undefined) {
    return "UNDEFINED";
  } else if (
    Object.prototype.toString.call(key) === "[object Object]" ||
    Object.prototype.toString.call(key) === "[object Array]"
  ) {
    return JSON.stringify(key);
  }
  return key.toString();
}

class Map {
  constructor() {
    this.items = {};
    this.size = 0;
  }

  set(key, value) {
    if (!this.has(key)) {
      this.items[defaultToString(key)] = value;
      this.size++;
    }
    return this;
  }

  get(key) {
    return this.items[defaultToString(key)];
  }

  has(key) {
    return this.items[defaultToString(key)] !== undefined;
  }

  delete(key) {
    if (this.has(key)) {
      delete this.items[key];
      this.size--;
    }
    return this;
  }

  clear() {
    this.items = {};
    this.size = 0;
  }

  keys() {
    let keys = [];
    for (let key in this.items) {
      if (this.has(key)) {
        keys.push(key);
      }
    }
    return keys;
  }

  values() {
    let values = [];
    for (let key in this.items) {
      if (this.has(key)) {
        values.push(this.items[key]);
      }
    }
    return values;
  }
}
复制代码;
```

### 实现 es6 的 class

参考代码[10]

## 🦉 其他

### instanceof

考察频率: (⭐⭐⭐⭐)

```js
function instance_of(Case, Constructor) {
  // 基本数据类型返回false
  // 兼容一下函数对象
  if ((typeof Case != "object" && typeof Case != "function") || Case == "null")
    return false;
  let CaseProto = Object.getPrototypeOf(Case);
  while (true) {
    // 查到原型链顶端，仍未查到，返回false
    if (CaseProto == null) return false;
    // 找到相同的原型
    if (CaseProto === Constructor.prototype) return true;
    CaseProto = Object.getPrototypeOf(CaseProto);
  }
}
复制代码;
```

### 实现千分位分隔符

考察频率: (⭐⭐⭐)

```js
var str = "100000000000",
  reg = /(?=(\B\d{3})+$)/g;
str.replace(reg, ",");
复制代码;
```

### 把一个 JSON 对象的 key 从下划线形式（Pascal）转换到小驼峰形式（Camel）

考察频率: (⭐⭐⭐)

参考代码[11]

### 实现数据类型判断函数

```js
function myTypeof(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}
复制代码;
```

### 实现数组转树

参考代码[12]

### 实现 sleep 函数

```js
// promise
const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
sleep(1000).then(() => {
  console.log(1);
});
// ES5
function sleep(callback, time) {
  if (typeof callback === "function") setTimeout(callback, time);
}

function output() {
  console.log(1);
}
sleep(output, 1000);

复制代码;
```

### 实现发布订阅模式

```js
class EventEmitter {
  constructor() {
    this.cache = {};
  }
  on(name, fn) {
    if (this.cache[name]) {
      this.cache[name].push(fn);
    } else {
      this.cache[name] = [fn];
    }
  }
  off(name, fn) {
    let tasks = this.cache[name];
    if (tasks) {
      const index = tasks.findIndex((f) => f === fn || f.callback === fn);
      if (index >= 0) {
        tasks.splice(index, 1);
      }
    }
  }
  emit(name, once = false, ...args) {
    if (this.cache[name]) {
      // 创建副本，如果回调函数内继续注册相同事件，会造成死循环
      let tasks = this.cache[name].slice();
      for (let fn of tasks) {
        fn(...args);
      }
      if (once) {
        delete this.cache[name];
      }
    }
  }
}
```

## 篇二

### 1.call 的实现

- 第一个参数为 null 或者 undefined 时，this 指向全局对象 window，值为原始值的指向该原始值的自动包装对象，如 String、Number、Boolean
- 为了避免函数名与上下文(context)的属性发生冲突，使用 Symbol 类型作为唯一值
- 将函数作为传入的上下文(context)属性执行
- 函数执行完成后删除该属性
- 返回执行结果

```js
Function.prototype.myCall = function (context, ...args) {
  let cxt = context || window;
  //将当前被调用的方法定义在cxt.func上.(为了能以对象调用形式绑定this)
  //新建一个唯一的Symbol变量避免重复
  let func = Symbol();
  cxt[func] = this;
  args = args ? args : [];
  //以对象调用形式调用func,此时this指向cxt 也就是传入的需要绑定的this指向
  const res = args.length > 0 ? cxt[func](...args) : cxt[func]();
  //删除该方法，不然会对传入对象造成污染（添加该方法）
  delete cxt[func];
  return res;
};
```

### 2.apply 的实现

- 前部分与 call 一样
- 第二个参数可以不传，但类型必须为数组或者类数组

```js
Function.prototype.myApply = function (context, args = []) {
  let cxt = context || window;
  //将当前被调用的方法定义在cxt.func上.(为了能以对象调用形式绑定this)
  //新建一个唯一的Symbol变量避免重复
  let func = Symbol();
  cxt[func] = this;
  //以对象调用形式调用func,此时this指向cxt 也就是传入的需要绑定的this指向
  const res = args.length > 0 ? cxt[func](...args) : cxt[func]();
  delete cxt[func];
  return res;
};
```

### 3.bind 的实现

需要考虑：

- bind() 除了 this 外，还可传入多个参数；
- bind 创建的新函数可能传入多个参数；
- 新函数可能被当做构造函数调用；
- 函数可能有返回值；

实现方法：

- bind 方法不会立即执行，需要返回一个待执行的函数；（闭包）
- 实现作用域绑定（apply）
- 参数传递（apply 的数组传参）
- 当作为构造函数的时候，进行原型继承

```js
Function.prototype.myBind = function (context, ...args) {
  //新建一个变量赋值为this，表示当前函数
  const fn = this;
  //判断有没有传参进来，若为空则赋值[]
  args = args ? args : [];
  //返回一个newFn函数，在里面调用fn
  return function newFn(...newFnArgs) {
    if (this instanceof newFn) {
      return new fn(...args, ...newFnArgs);
    }
    return fn.apply(context, [...args, ...newFnArgs]);
  };
};
```

- 测试

```js
let name = "小王",
  age = 17;
let obj = {
  name: "小张",
  age: this.age,
  myFun: function (from, to) {
    console.log(this.name + " 年龄 " + this.age + "来自 " + from + "去往" + to);
  },
};
let db = {
  name: "德玛",
  age: 99,
};

//结果
obj.myFun.myCall(db, "成都", "上海"); // 德玛 年龄 99  来自 成都去往上海
obj.myFun.myApply(db, ["成都", "上海"]); // 德玛 年龄 99  来自 成都去往上海
obj.myFun.myBind(db, "成都", "上海")(); // 德玛 年龄 99  来自 成都去往上海
obj.myFun.myBind(db, ["成都", "上海"])(); // 德玛 年龄 99  来自 成都, 上海去往 undefined
```

### 4.寄生式组合继承

```js
function Person(obj) {
  this.name = obj.name;
  this.age = obj.age;
}
Person.prototype.add = function (value) {
  console.log(value);
};
var p1 = new Person({ name: "番茄", age: 18 });

function Person1(obj) {
  Person.call(this, obj);
  this.sex = obj.sex;
}
// 这一步是继承的关键
Person1.prototype = Object.create(Person.prototype);
Person1.prototype.constructor = Person1;

Person1.prototype.play = function (value) {
  console.log(value);
};
var p2 = new Person1({ name: "鸡蛋", age: 118, sex: "男" });
```

### 5.ES6 继承

```js
//class 相当于es5中构造函数
//class中定义方法时，前后不能加function，全部定义在class的protopyte属性中
//class中定义的所有方法是不可枚举的
//class中只能定义方法，不能定义对象，变量等
//class和方法内默认都是严格模式
//es5中constructor为隐式属性
class People {
  constructor(name = "wang", age = "27") {
    this.name = name;
    this.age = age;
  }
  eat() {
    console.log(`${this.name} ${this.age} eat food`);
  }
}
//继承父类
class Woman extends People {
  constructor(name = "ren", age = "27") {
    //继承父类属性
    super(name, age);
  }
  eat() {
    //继承父类方法
    super.eat();
  }
}
let wonmanObj = new Woman("xiaoxiami");
wonmanObj.eat();

//es5继承先创建子类的实例对象，然后再将父类的方法添加到this上（Parent.apply(this)）。
//es6继承是使用关键字super先创建父类的实例对象this，最后在子类class中修改this。
```

### 6.new 的实现

- 一个继承自 Foo.prototype 的新对象被创建。
- 使用指定的参数调用构造函数 Foo，并将 this 绑定到新创建的对象。new Foo 等同于 new Foo()，也就是没有指定参数列表，Foo 不带任何参数调用的情况。
- 由构造函数返回的对象就是 new 表达式的结果。如果构造函数没有显式返回一个对象，则使用步骤 1 创建的对象。
- 一般情况下，构造函数不返回值，但是用户可以选择主动返回对象，来覆盖正常的对象创建步骤

```js
function Ctor(){
    ....
}

function myNew(ctor,...args){
    if(typeof ctor !== 'function'){
      throw 'myNew function the first param must be a function';
    }
    var newObj = Object.create(ctor.prototype); //创建一个继承自ctor.prototype的新对象
    var ctorReturnResult = ctor.apply(newObj, args); //将构造函数ctor的this绑定到newObj中
    var isObject = typeof ctorReturnResult === 'object' && ctorReturnResult !== null;
    var isFunction = typeof ctorReturnResult === 'function';
    if(isObject || isFunction){
        return ctorReturnResult;
    }
    return newObj;
}

let c = myNew(Ctor);

```

### 7.instanceof 的实现

- instanceof 是用来判断 A 是否为 B 的实例，表达式为：A instanceof B，如果 A 是 B 的实例，则返回 true,否则返回 false。
- instanceof 运算符用来测试一个对象在其原型链中是否存在一个构造函数的 prototype 属性。
- 不能检测基本数据类型，在原型链上的结果未必准确，不能检测 null,undefined
- 实现：遍历左边变量的原型链，直到找到右边变量的 prototype，如果没有找到，返回 false

```js
function myInstanceOf(a, b) {
  let left = a.__proto__;
  let right = b.prototype;
  while (true) {
    if (left == null) {
      return false;
    }
    if (left == right) {
      return true;
    }
    left = left.__proto__;
  }
}

//instanceof 运算符用于判断构造函数的 prototype 属性是否出现在对象的原型链中的任何位置。
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left), // 获取对象的原型
    prototype = right.prototype; // 获取构造函数的 prototype 对象
  // 判断构造函数的 prototype 对象是否在对象的原型链上
  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}
```

### 8.Object.create()的实现

- MDN 文档
- Object.create()会将参数对象作为一个新创建的空对象的原型, 并返回这个空对象

```js
//简略版
function myCreate(obj) {
  // 新声明一个函数
  function C() {}
  // 将函数的原型指向obj
  C.prototype = obj;
  // 返回这个函数的实力化对象
  return new C();
}
//官方版Polyfill
if (typeof Object.create !== "function") {
  Object.create = function (proto, propertiesObject) {
    if (typeof proto !== "object" && typeof proto !== "function") {
      throw new TypeError("Object prototype may only be an Object: " + proto);
    } else if (proto === null) {
      throw new Error(
        "This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument."
      );
    }

    if (typeof propertiesObject !== "undefined")
      throw new Error(
        "This browser's implementation of Object.create is a shim and doesn't support a second argument."
      );

    function F() {}
    F.prototype = proto;

    return new F();
  };
}
```

### 9.实现 Object.assign

```js
Object.assign2 = function (target, ...source) {
  if (target == null) {
    throw new TypeError("Cannot convert undefined or null to object");
  }
  let ret = Object(target);
  source.forEach(function (obj) {
    if (obj != null) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          ret[key] = obj[key];
        }
      }
    }
  });
  return ret;
};
```

### 10.Promise 的实现

实现 Promise 需要完全读懂 Promise A+ 规范，不过从总体的实现上看，有如下几个点需要考虑到：

- Promise 本质是一个状态机，且状态只能为以下三种：Pending（等待态）、Fulfilled（执行态）、Rejected（拒绝态），状态的变更是单向的，只能从 Pending -> Fulfilled 或 Pending -> Rejected，状态变更不可逆
- then 需要支持链式调用

```js
class Promise {
  callbacks = [];
  state = "pending"; //增加状态
  value = null; //保存结果
  constructor(fn) {
    fn(this._resolve.bind(this), this._reject.bind(this));
  }
  then(onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
      this._handle({
        onFulfilled: onFulfilled || null,
        onRejected: onRejected || null,
        resolve: resolve,
        reject: reject,
      });
    });
  }
  _handle(callback) {
    if (this.state === "pending") {
      this.callbacks.push(callback);
      return;
    }

    let cb =
      this.state === "fulfilled" ? callback.onFulfilled : callback.onRejected;

    if (!cb) {
      //如果then中没有传递任何东西
      cb = this.state === "fulfilled" ? callback.resolve : callback.reject;
      cb(this.value);
      return;
    }

    let ret = cb(this.value);
    cb = this.state === "fulfilled" ? callback.resolve : callback.reject;
    cb(ret);
  }
  _resolve(value) {
    if (value && (typeof value === "object" || typeof value === "function")) {
      var then = value.then;
      if (typeof then === "function") {
        then.call(value, this._resolve.bind(this), this._reject.bind(this));
        return;
      }
    }

    this.state = "fulfilled"; //改变状态
    this.value = value; //保存结果
    this.callbacks.forEach((callback) => this._handle(callback));
  }
  _reject(error) {
    this.state = "rejected";
    this.value = error;
    this.callbacks.forEach((callback) => this._handle(callback));
  }
}
```

#### Promise.resolve

- Promsie.resolve(value) 可以将任何值转成值为 value 状态是 fulfilled 的 Promise，但如果传入的值本身是 Promise 则会原样返回它。

```js
Promise.resolve(value) {
  if (value && value instanceof Promise) {
    return value;
  } else if (value && typeof value === 'object' && typeof value.then === 'function') {
    let then = value.then;
    return new Promise(resolve => {
      then(resolve);
    });
  } else if (value) {
    return new Promise(resolve => resolve(value));
  } else {
    return new Promise(resolve => resolve());
  }
}

```

#### Promise.reject

- 和 Promise.resolve() 类似，Promise.reject() 会实例化一个 rejected 状态的 Promise。但与 Promise.resolve() 不同的是，如果给 Promise.reject() 传递一个 Promise 对象，则这个对象会成为新 Promise 的值。

```js
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => reject(reason));
};
```

#### Promise.all

- 传入的所有 Promsie 都是 fulfilled，则返回由他们的值组成的，状态为 fulfilled 的新 Promise；
- 只要有一个 Promise 是 rejected，则返回 rejected 状态的新 Promsie，且它的值是第一个 rejected 的 Promise 的值；
- 只要有一个 Promise 是 pending，则返回一个 pending 状态的新 Promise；

```js
Promise.all = function (promiseArr) {
  let index = 0,
    result = [];
  return new Promise((resolve, reject) => {
    promiseArr.forEach((p, i) => {
      Promise.resolve(p).then(
        (val) => {
          index++;
          result[i] = val;
          if (index === promiseArr.length) {
            resolve(result);
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  });
};
```

#### Promise.race

- Promise.race 会返回一个由所有可迭代实例中第一个 fulfilled 或 rejected 的实例包装后的新实例。

```js
Promise.race = function (promiseArr) {
  return new Promise((resolve, reject) => {
    promiseArr.forEach((p) => {
      Promise.resolve(p).then(
        (val) => {
          resolve(val);
        },
        (err) => {
          rejecte(err);
        }
      );
    });
  });
};
```

### 11.Ajax 的实现

```js
function ajax(url, method, body, headers) {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open(methods, url);
    for (let key in headers) {
      req.setRequestHeader(key, headers[key]);
    }
    req.onreadystatechange(() => {
      if (req.readystate == 4) {
        if (req.status >= "200" && req.status <= 300) {
          resolve(req.responeText);
        } else {
          reject(req);
        }
      }
    });
    req.send(body);
  });
}
```

### 12.实现防抖函数（debounce）

- 连续触发在最后一次执行方法，场景：输入框匹配

```js
let debounce = (fn, time = 1000) => {
  let timeLock = null;

  return function (...args) {
    clearTimeout(timeLock);
    timeLock = setTimeout(() => {
      fn(...args);
    }, time);
  };
};
```

### 13.实现节流函数（throttle）

- 在一定时间内只触发一次，场景：长列表滚动节流

```js
let throttle = (fn, time = 1000) => {
  let flag = true;

  return function (...args) {
    if (flag) {
      flag = false;
      setTimeout(() => {
        flag = true;
        fn(...args);
      }, time);
    }
  };
};
```

### 14.深拷贝（deepclone）

- 判断类型，正则和日期直接返回新对象
- 空或者非对象类型，直接返回原值
- 考虑循环引用，判断如果 hash 中含有直接返回 hash 中的值
- 新建一个相应的 new obj.constructor 加入 hash
- 遍历对象递归（普通 key 和 key 是 symbol 情况）

```js
function deepClone(obj, hash = new WeakMap()) {
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Date) return new Date(obj);
  if (obj === null || typeof obj !== "object") return obj;
  //循环引用的情况
  if (hash.has(obj)) {
    return hash.get(obj);
  }
  //new 一个相应的对象
  //obj为Array，相当于new Array()
  //obj为Object，相当于new Object()
  let constr = new obj.constructor();
  hash.set(obj, constr);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      constr[key] = deepClone(obj[key], hash);
    }
  }
  //考虑symbol的情况
  let symbolObj = Object.getOwnPropertySymbols(obj);
  for (let i = 0; i < symbolObj.length; i++) {
    if (obj.hasOwnProperty(symbolObj[i])) {
      constr[symbolObj[i]] = deepClone(obj[symbolObj[i]], hash);
    }
  }
  return constr;
}
```

### 15.数组扁平化的实现(flat)

```js
let arr = [1, 2, [3, 4, [5, [6]]]];
console.log(arr.flat(Infinity)); //flat参数为指定要提取嵌套数组的结构深度，默认值为 1
```

```js
//用reduce实现
function fn(arr) {
  return arr.reduce((prev, cur) => {
    return prev.concat(Array.isArray(cur) ? fn(cur) : cur);
  }, []);
}
```

### 16.函数柯里化

```js
function sumFn(a, b, c) {
  return a + b + c;
}
let sum = curry(sumFn);
sum(2)(3)(5); //10
sum(2, 3)(5); //10
```

```js
function curry(fn, ...args) {
  let fnLen = fn.length,
    argsLen = args.length;
  //对比函数的参数和当前传入参数
  //若参数不够就继续递归返回curry
  //若参数够就调用函数返回相应的值
  if (fnLen > argsLen) {
    return function (...arg2s) {
      return curry(fn, ...args, ...arg2s);
    };
  } else {
    return fn(...args);
  }
}
```

### 17.使用闭包实现每隔一秒打印 1,2,3,4

```js
for (var i = 1; i <= 5; i++) {
  (function (i) {
    setTimeout(() => console.log(i), 1000 * i);
  })(i);
}
```

### 18.手写一个 jsonp

```js
const jsonp = function (url, data) {
  return new Promise((resolve, reject) => {
    // 初始化url
    let dataString = url.indexOf("?") === -1 ? "?" : "";
    let callbackName = `jsonpCB_${Date.now()}`;
    url += `${dataString}callback=${callbackName}`;
    if (data) {
      // 有请求参数，依次添加到url
      for (let k in data) {
        url += `${k}=${data[k]}`;
      }
    }
    let jsNode = document.createElement("script");
    jsNode.src = url;
    // 触发callback，触发后删除js标签和绑定在window上的callback
    window[callbackName] = (result) => {
      delete window[callbackName];
      document.body.removeChild(jsNode);
      if (result) {
        resolve(result);
      } else {
        reject("没有返回数据");
      }
    };
    // js加载异常的情况
    jsNode.addEventListener(
      "error",
      () => {
        delete window[callbackName];
        document.body.removeChild(jsNode);
        reject("JavaScript资源加载失败");
      },
      false
    );
    // 添加js节点到document上时，开始请求
    document.body.appendChild(jsNode);
  });
};
jsonp("http://192.168.0.103:8081/jsonp", {
  a: 1,
  b: "heiheihei",
})
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error(err);
  });
```

### 19.手写一个观察者模式

```js
class Subject {
  constructor(name) {
    this.name = name;
    this.observers = [];
    this.state = "XXXX";
  }
  // 被观察者要提供一个接受观察者的方法
  attach(observer) {
    this.observers.push(observer);
  }

  // 改变被观察着的状态
  setState(newState) {
    this.state = newState;
    this.observers.forEach((o) => {
      o.update(newState);
    });
  }
}

class Observer {
  constructor(name) {
    this.name = name;
  }

  update(newState) {
    console.log(`${this.name}say:${newState}`);
  }
}

// 被观察者 灯
let sub = new Subject("灯");
let mm = new Observer("小明");
let jj = new Observer("小健");

// 订阅 观察者
sub.attach(mm);
sub.attach(jj);

sub.setState("灯亮了来电了");
```

### 20.EventEmitter 实现

```js
class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, callback) {
    let callbacks = this.events[event] || [];
    callbacks.push(callback);
    this.events[event] = callbacks;
    return this;
  }
  off(event, callback) {
    let callbacks = this.events[event];
    this.events[event] = callbacks && callbacks.filter((fn) => fn !== callback);
    return this;
  }
  emit(event, ...args) {
    let callbacks = this.events[event];
    callbacks.forEach((fn) => {
      fn(...args);
    });
    return this;
  }
  once(event, callback) {
    let wrapFun = function (...args) {
      callback(...args);
      this.off(event, wrapFun);
    };
    this.on(event, wrapFun);
    return this;
  }
}
```

### 21.生成随机数的各种方法？

```js
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
```

### 22.如何实现数组的随机排序？

```js
let arr = [2, 3, 454, 34, 324, 32];
arr.sort(randomSort);
function randomSort(a, b) {
  return Math.random() > 0.5 ? -1 : 1;
}
```

### 23.写一个通用的事件侦听器函数。

```js
const EventUtils = {
  // 视能力分别使用dom0||dom2||IE方式 来绑定事件
  // 添加事件
  addEvent: function (element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
  },
  // 移除事件
  removeEvent: function (element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent("on" + type, handler);
    } else {
      element["on" + type] = null;
    }
  },
  // 获取事件目标
  getTarget: function (event) {
    return event.target || event.srcElement;
  },
  // 获取 event 对象的引用，取到事件的所有信息，确保随时能使用 event
  getEvent: function (event) {
    return event || window.event;
  },
  // 阻止事件（主要是事件冒泡，因为 IE 不支持事件捕获）
  stopPropagation: function (event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  },
  // 取消事件的默认行为
  preventDefault: function (event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },
};
```

### 24.使用迭代的方式实现 flatten 函数。

```js
var arr = [1, 2, 3, [4, 5], [6, [7, [8]]]];
/** * 使用递归的方式处理 * wrap 内保
存结果 ret * 返回一个递归函数 **/
function wrap() {
  var ret = [];
  return function flat(a) {
    for (var item of a) {
      if (item.constructor === Array) {
        ret.concat(flat(item));
      } else {
        ret.push(item);
      }
    }
    return ret;
  };
}
console.log(wrap()(arr));
```

### 25.怎么实现一个 sleep

- sleep 函数作用是让线程休眠，等到指定时间在重新唤起。

```js
function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() - start < delay) {
    continue;
  }
}

function test() {
  console.log("111");
  sleep(2000);
  console.log("222");
}

test();
```

### 26.实现正则切分千分位（10000 => 10,000）

```js
//无小数点
let num1 = "1321434322222";
num1.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
//有小数点
let num2 = "342243242322.3432423";
num2.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
```

### 27.对象数组去重

```js
输入: [
  { a: 1, b: 2, c: 3 },
  { b: 2, c: 3, a: 1 },
  { d: 2, c: 2 },
];
输出: [
  { a: 1, b: 2, c: 3 },
  { d: 2, c: 2 },
];
```

- 首先写一个函数把对象中的 key 排序，然后再转成字符串
- 遍历数组利用 Set 将转为字符串后的对象去重

```js
function objSort(obj) {
  let newObj = {};
  //遍历对象，并将key进行排序
  Object.keys(obj)
    .sort()
    .map((key) => {
      newObj[key] = obj[key];
    });
  //将排序好的数组转成字符串
  return JSON.stringify(newObj);
}

function unique(arr) {
  let set = new Set();
  for (let i = 0; i < arr.length; i++) {
    let str = objSort(arr[i]);
    set.add(str);
  }
  //将数组中的字符串转回对象
  arr = [...set].map((item) => {
    return JSON.parse(item);
  });
  return arr;
}
```

### 28.解析 URL Params 为对象

```js
let url =
  "http://www.domain.com/?user=anonymous&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled";
parseParam(url);
/* 结果
{ user: 'anonymous',
  id: [ 123, 456 ], // 重复出现的 key 要组装成数组，能被转成数字的就转成数字类型
  city: '北京', // 中文需解码
  enabled: true, // 未指定值得 key 约定为 true
}
*/
```

```js
function parseParam(url) {
  const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
  const paramsArr = paramsStr.split("&"); // 将字符串以 & 分割后存到数组中
  let paramsObj = {};
  // 将 params 存到对象中
  paramsArr.forEach((param) => {
    if (/=/.test(param)) {
      // 处理有 value 的参数
      let [key, val] = param.split("="); // 分割 key 和 value
      val = decodeURIComponent(val); // 解码
      val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字

      if (paramsObj.hasOwnProperty(key)) {
        // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val);
      } else {
        // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val;
      }
    } else {
      // 处理没有 value 的参数
      paramsObj[param] = true;
    }
  });

  return paramsObj;
}
```

### 29.模板引擎实现

```js
let template = "我是{{name}}，年龄{{age}}，性别{{sex}}";
let data = {
  name: "姓名",
  age: 18,
};
render(template, data); // 我是姓名，年龄18，性别undefined
```

```js
function render(template, data) {
  const reg = /\{\{(\w+)\}\}/; // 模板字符串正则
  if (reg.test(template)) {
    // 判断模板里是否有模板字符串
    const name = reg.exec(template)[1]; // 查找当前模板里第一个模板字符串的字段
    template = template.replace(reg, data[name]); // 将第一个模板字符串渲染
    return render(template, data); // 递归的渲染并返回渲染后的结构
  }
  return template; // 如果模板没有模板字符串直接返回
}
```

### 30.转化为驼峰命名

```js
var s1 = "get-element-by-id";
// 转化为 getElementById
```

```js
var f = function (s) {
  return s.replace(/-\w/g, function (x) {
    return x.slice(1).toUpperCase();
  });
};
```

### 31.查找字符串中出现最多的字符和个数

- 例: abbcccddddd -> 字符最多的是 d，出现了 5 次

```js
let str = "abcabcabcbbccccc";
let num = 0;
let char = "";

// 使其按照一定的次序排列
str = str.split("").sort().join("");
// "aaabbbbbcccccccc"

// 定义正则表达式
let re = /(\w)\1+/g;
str.replace(re, ($0, $1) => {
  if (num < $0.length) {
    num = $0.length;
    char = $1;
  }
});
console.log(`字符最多的是${char}，出现了${num}次`);
```

### 32.图片懒加载

```js
let imgList = [...document.querySelectorAll("img")];
let length = imgList.length;

const imgLazyLoad = function () {
  let count = 0;
  return (function () {
    let deleteIndexList = [];
    imgList.forEach((img, index) => {
      let rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        img.src = img.dataset.src;
        deleteIndexList.push(index);
        count++;
        if (count === length) {
          document.removeEventListener("scroll", imgLazyLoad);
        }
      }
    });
    imgList = imgList.filter((img, index) => !deleteIndexList.includes(index));
  })();
};

// 这里最好加上防抖处理
document.addEventListener("scroll", imgLazyLoad);
```

有些重复的，可做参考 ⭐ 。
