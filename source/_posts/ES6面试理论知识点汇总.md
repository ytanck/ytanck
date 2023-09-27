---
title: ES6面试理论知识点汇总
date: 2023-01-01 10:15:20
categories: 
 - [前端]
tags: [JavaScript,ES6, 面试]
---

### 一、问：ES6 是什么，为什么要学习它，不学习 ES6 会怎么样?

答：ES6 是新一代的 JS 语言标准，对分 JS 语言核心内容做了升级优化，规范了 JS 使用标准，新增了 JS 原生方法，使得 JS 使用更加规范，更加优雅，更适合大型应用的开发。学习 ES6 是成为专业前端正规军的必经之路。不学习 ES6 也可以写代码打鬼子，但是最多只能当个游击队长。

### 二、问：ES5、ES6 和 ES2015 有什么区别?

答：ES2015 特指在 2015 年发布的新一代 JS 语言标准，ES6 泛指下一代 JS 语言标准，包含 ES2015、ES2016、ES2017、ES2018 等。现阶段在绝大部分场景下，ES2015 默认等同 ES6。ES5 泛指上一代语言标准。ES2015 可以理解为 ES5 和 ES6 的时间分界线。

### 三、问：babel 是什么，有什么作用?

答：babel 是一个 ES6 转码器，可以将 ES6 代码转为 ES5 代码，以便兼容那些还没支持 ES6 的平台。

### 四、问：let 有什么用，有了 var 为什么还要用 let？

答：在 ES6 之前，声明变量只能用 var，var 方式声明变量其实是很不合理的，准确的说，是因为 ES5 里面没有块级作用域是很不合理的，甚至可以说是一个语言层面的 bug(这也是很多 c++、java 开发人员看不懂，也瞧不起 JS 语言的劣势之一)。没有块级作用域会带来很多难以理解的问题，比如 for 循环 var 变量泄露，变量覆盖等问题。let 声明的变量**拥有自己的块级作用域**，且修复了 var 声明变量带来的**变量提升问题**。

### 五、问：举一些 ES6 对 String 字符串类型做的常用升级优化?

答：

#### 1、优化部分：

ES6 新增了字符串模板，在拼接大段字符串时，用反斜杠(`)取代以往的字符串相加的形式，能保留所有空格和换行，使得字符串拼接看起来更加直观，更加优雅。

#### 2、升级部分:

ES6 在 String 原型上新增了 includes()方法，用于取代传统的只能用 indexOf 查找包含字符的方法(indexOf 返回-1 表示没查到不如 includes 方法返回 false 更明确，语义更清晰), 此外还新增了 startsWith(), endsWith(), padStart(),padEnd(),repeat()等方法，可方便的用于查找，补全字符串。

### 六、问：举一些 ES6 对 Array 数组类型做的常用升级优化?

答：

#### 1、优化部分：

**a.** 数组解构赋值。ES6 可以直接以`let [a,b,c] = [1,2,3]`形式进行变量赋值，在声明较多变量时，不用再写很多 let(var),且映射关系清晰，且支持赋默认值。

**b.** 扩展运算符。ES6 新增的扩展运算符(...)(重要),可以轻松的实现数组和松散序列的相互转化，可以取代 arguments 对象和 apply 方法，轻松获取未知参数个数情况下的参数集合。（尤其是在 ES5 中，arguments 并不是一个真正的数组，而是一个类数组的对象，但是扩展运算符的逆运算却可以返回一个真正的数组）。扩展运算符还可以轻松方便的实现数组的复制和解构赋值（`let a = [2,3,4]; let b = [...a]`）。

#### 2、升级部分:

ES6 在 Array 原型上新增了 find()方法，用于取代传统的只能用 indexOf 查找包含数组项目的方法,且修复了 indexOf 查找不到 NaN 的 bug(`[NaN].indexOf(NaN) === -1`).此外还新增了 copyWithin(), includes(), fill(),flat()等方法，可方便的用于字符串的查找，补全,转换等。

### 七、问：举一些 ES6 对 Number 数字类型做的常用升级优化?

答：

#### 1、优化部分：

ES6 在 Number 原型上新增了 isFinite(), isNaN()方法，用来取代传统的全局 isFinite(), isNaN()方法检测数值是否有限、是否是 NaN。ES5 的 isFinite(), isNaN()方法都会先将非数值类型的参数转化为 Number 类型再做判断，这其实是不合理的，最造成`isNaN('NaN') === true`的奇怪行为--'NaN'是一个字符串，但是 isNaN 却说这就是 NaN。而 Number.isFinite()和 Number.isNaN()则不会有此类问题(`Number.isNaN('NaN') === false`)。（isFinite()同上）

#### 2、升级部分:

ES6 在 Math 对象上新增了 Math.cbrt()，trunc()，hypot()等等较多的科学计数法运算方法，可以更加全面的进行立方根、求和立方根等等科学计算。

### 八、问：举一些 ES6 对 Object 类型做的常用升级优化?(重要)

答：

#### 1、优化部分：

**a.** 对象属性变量式声明。ES6 可以直接以变量形式声明对象属性或者方法，。比传统的键值对形式声明更加简洁，更加方便，语义更加清晰。

```js
let [apple, orange] = ["red appe", "yellow orange"];
let myFruits = { apple, orange }; // let myFruits = {apple: 'red appe', orange: 'yellow orange'};
```

尤其在对象解构赋值(见优化部分 b.)或者模块输出变量时，这种写法的好处体现的最为明显:

```js
let { keys, values, entries } = Object;
let MyOwnMethods = { keys, values, entries }; // let MyOwnMethods = {keys: keys, values: values, entries: entries}
```

可以看到属性变量式声明属性看起来更加简洁明了。方法也可以采用简洁写法：

```js
let es5Fun = {
  method: function () {},
};
let es6Fun = {
  method() {},
};
```

**b.** 对象的解构赋值。ES6 对象也可以像数组解构赋值那样，进行变量的解构赋值：

```js
let { apple, orange } = { apple: "red appe", orange: "yellow orange" };
```

**c.** 对象的扩展运算符(...)。ES6 对象的扩展运算符和数组扩展运算符用法本质上差别不大，毕竟数组也就是特殊的对象。对象的扩展运算符一个最常用也最好用的用处就在于可以轻松的取出一个目标对象内部全部或者部分的可遍历属性，从而进行对象的合并和分解。

```js
let { apple, orange, ...otherFruits } = {
  apple: "red apple",
  orange: "yellow orange",
  grape: "purple grape",
  peach: "sweet peach",
};
// otherFruits  {grape: 'purple grape', peach: 'sweet peach'}
// 注意: 对象的扩展运算符用在解构赋值时，扩展运算符只能用在最后一个参数(otherFruits后面不能再跟其他参数)
let moreFruits = { watermelon: "nice watermelon" };
let allFruits = { apple, orange, ...otherFruits, ...moreFruits };
```

**d.** super 关键字。ES6 在 Class 类里新增了类似 this 的关键字 super。同 this 总是指向当前函数所在的对象不同，super 关键字总是指向当前函数所在对象的原型对象。

#### 2、升级部分:

**a.** ES6 在 Object 原型上新增了 is()方法，做两个目标对象的相等比较，用来完善'==='方法。'==='方法中`NaN === NaN //false`其实是不合理的，Object.is 修复了这个小 bug。(`Object.is(NaN, NaN) // true`)

**b.** ES6 在 Object 原型上新增了 assign()方法，用于对象新增属性或者多个对象合并。

```js
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };
Object.assign(target, source1, source2);
target; // {a:1, b:2, c:3}
```

注意: assign 合并的对象 target 只能合并 source1、source2 中的自身属性，并不会合并 source1、source2 中的继承属性，也不会合并不可枚举的属性，且无法正确复制 get 和 set 属性（会直接执行 get/set 函数，取 return 的值）。

**c.** ES6 在 Object 原型上新增了 getOwnPropertyDescriptors()方法，此方法增强了 ES5 中 getOwnPropertyDescriptor()方法，可以获取指定对象所有自身属性的描述对象。结合 defineProperties()方法，可以完美复制对象，包括复制 get 和 set 属性。

**d.** ES6 在 Object 原型上新增了 getPrototypeOf()和 setPrototypeOf()方法，用来获取或设置当前对象的 prototype 对象。这个方法存在的意义在于，ES5 中获取设置 prototype 对像是通过**proto**属性来实现的，然而**proto**属性并不是 ES 规范中的明文规定的属性，只是浏览器各大产商“私自”加上去的属性，只不过因为适用范围广而被默认使用了，再非浏览器环境中并不一定就可以使用，所以为了稳妥起见，获取或设置当前对象的 prototype 对象时，都应该采用 ES6 新增的标准用法。

**e.** ES6 在 Object 原型上还新增了 Object.keys()，Object.values()，Object.entries()方法，用来获取对象的所有键、所有值和所有键值对数组。

### 九、问：举一些 ES6 对 Function 函数类型做的常用升级优化?(重要)

答：

#### 1、优化部分：

**a.** 箭头函数**(核心)**。箭头函数是 ES6 核心的升级项之一，箭头函数里没有自己的 this,这改变了以往 JS 函数中最让人难以理解的 this 运行机制。主要优化点:

Ⅰ. **箭头函数内的 this 指向的是函数定义时所在的对象，而不是函数执行时所在的对象**。ES5 函数里的 this 总是指向函数执行时所在的对象，这使得在很多情况下 this 的指向变得很难理解，尤其是非严格模式情况下，this 有时候会指向全局对象，这甚至也可以归结为语言层面的 bug 之一。ES6 的箭头函数优化了这一点，它的内部没有自己的 this,这也就导致了 this 总是指向上一层的 this，如果上一层还是箭头函数，则继续向上指，直到指向到有自己 this 的函数为止，并作为自己的 this。

Ⅱ. 箭头函数不能用作构造函数，因为它没有自己的 this，无法实例化。

Ⅲ. 也是因为箭头函数没有自己的 this,所以箭头函数 内也不存在 arguments 对象。（可以用扩展运算符代替）

**b.** 函数默认赋值。ES6 之前，函数的形参是无法给默认值得，只能在函数内部通过变通方法实现。ES6 以更简洁更明确的方式进行函数默认赋值。

```js
function es6Fuc(x, y = "default") {
  console.log(x, y);
}
es6Fuc(4); // 4, default
```

#### 2、升级部分:

ES6 新增了双冒号运算符，用来取代以往的 bind，call,和 apply。(浏览器暂不支持，Babel 已经支持转码)

```js
foo::bar;
// 等同于
bar.bind(foo);

foo::bar(...arguments);
// 等同于
bar.apply(foo, arguments);
复制代码;
```

### 十、问：Symbol 是什么，有什么作用？

答：Symbol 是 ES6 引入的第七种原始数据类型（说法不准确，应该是第七种数据类型，Object 不是原始数据类型之一，已更正），所有 Symbol()生成的值都是独一无二的，可以从根本上解决对象属性太多导致属性名冲突覆盖的问题。对象中 Symbol()属性不能被 for...in 遍历，但是也不是私有属性。

### 十一、问：Set 是什么，有什么作用？

答：Set 是 ES6 引入的一种类似 Array 的新的数据结构，Set 实例的成员类似于数组 item 成员，区别是 Set 实例的成员都是唯一，不重复的。这个特性可以轻松地实现数组去重。

### 十二、问：Map 是什么，有什么作用？

答：Map 是 ES6 引入的一种类似 Object 的新的数据结构，Map 可以理解为是 Object 的超集，打破了以传统键值对形式定义对象，对象的 key 不再局限于字符串，也可以是 Object。可以更加全面的描述对象的属性。

### 十三、问：Proxy 是什么，有什么作用？

答：Proxy 是 ES6 新增的一个构造函数，可以理解为 JS 语言的一个代理，用来改变 JS 默认的一些语言行为，包括拦截默认的 get/set 等底层方法，使得 JS 的使用自由度更高，可以最大限度的满足开发者的需求。比如通过拦截对象的 get/set 方法，可以轻松地定制自己想要的 key 或者 value。下面的例子可以看到，随便定义一个 myOwnObj 的 key,都可以变成自己想要的函数。

```js
function createMyOwnObj() {
  //想把所有的key都变成函数，或者Promise,或者anything
  return new Proxy(
    {},
    {
      get(target, propKey, receiver) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            let randomBoolean = Math.random() > 0.5;
            let Message;
            if (randomBoolean) {
              Message = `你的${propKey}运气不错，成功了`;
              resolve(Message);
            } else {
              Message = `你的${propKey}运气不行，失败了`;
              reject(Message);
            }
          }, 1000);
        });
      },
    }
  );
}

let myOwnObj = createMyOwnObj();

myOwnObj.hahaha
  .then((result) => {
    console.log(result); //你的hahaha运气不错，成功了
  })
  .catch((error) => {
    console.log(error); //你的hahaha运气不行，失败了
  });

myOwnObj.wuwuwu
  .then((result) => {
    console.log(result); //你的wuwuwu运气不错，成功了
  })
  .catch((error) => {
    console.log(error); //你的wuwuwu运气不行，失败了
  });
```

### 十四、问：Reflect 是什么，有什么作用？

答：Reflect 是 ES6 引入的一个新的对象，他的主要作用有两点，一是将原生的一些零散分布在 Object、Function 或者全局函数里的方法(如 apply、delete、get、set 等等)，统一整合到 Reflect 上，这样可以更加方便更加统一的管理一些原生 API。其次就是因为 Proxy 可以改写默认的原生 API，如果一旦原生 API 别改写可能就找不到了，所以 Reflect 也可以起到备份原生 API 的作用，使得即使原生 API 被改写了之后，也可以在被改写之后的 API 用上默认的 API。

### 十五、问：Promise 是什么，有什么作用？

答：Promise 是 ES6 引入的一个新的对象，他的主要作用是用来解决 JS 异步机制里，回调机制产生的“回调地狱”。它并不是什么突破性的 API，只是封装了异步回调形式，使得异步回调可以写的更加优雅，可读性更高，而且可以链式调用。

附录：[15 道 ES6 Promise 实战练习题](http://mp.weixin.qq.com/s?__biz=MzAxODE4MTEzMA==&mid=2650084846&idx=2&sn=df481aa2f00e749f8223782c069bb86a&chksm=83db888bb4ac019d839c04bf0751f013adeef8dd426c9882b5a0583abb276e52783367910125&scene=21#wechat_redirect)

### 十六、问：Iterator 是什么，有什么作用？(重要)

答：Iterator 是 ES6 中一个很重要概念，它并不是对象，也不是任何一种数据类型。因为 ES6 新增了 Set、Map 类型，他们和 Array、Object 类型很像，Array、Object 都是可以遍历的，但是 Set、Map 都不能用 for 循环遍历，解决这个问题有两种方案，一种是为 Set、Map 单独新增一个用来遍历的 API，另一种是为 Set、Map、Array、Object 新增一个统一的遍历 API，显然，第二种更好，ES6 也就顺其自然的需要一种设计标准，来统一所有可遍历类型的遍历方式。Iterator 正是这样一种标准。或者说是一种规范理念。

就好像 JavaScript 是 ECMAScript 标准的一种具体实现一样，Iterator 标准的具体实现是 Iterator 遍历器。Iterator 标准规定，所有部署了 key 值为[Symbol.iterator]，且[Symbol.iterator]的 value 是标准的 Iterator 接口函数(标准的 Iterator 接口函数: 该函数必须返回一个对象，且对象中包含 next 方法，且执行 next()能返回包含 value/done 属性的 Iterator 对象)的对象，都称之为可遍历对象，next()后返回的 Iterator 对象也就是 Iterator 遍历器。

```js
//obj就是可遍历的，因为它遵循了Iterator标准，且包含[Symbol.iterator]方法，方法函数也符合标准的Iterator接口规范。
//obj.[Symbol.iterator]() 就是Iterator遍历器
let obj = {
  data: ["hello", "world"],
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    return {
      next() {
        if (index < self.data.length) {
          return {
            value: self.data[index++],
            done: false,
          };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  },
};
```

ES6 给 Set、Map、Array、String 都加上了[Symbol.iterator]方法，且[Symbol.iterator]方法函数也符合标准的 Iterator 接口规范，所以 Set、Map、Array、String 默认都是可以遍历的。

```js
//Array
let array = ['red', 'green', 'blue'];
array[Symbol.iterator]() //Iterator遍历器
array[Symbol.iterator]().next() //{value: "red", done: false}

//String
let string = '1122334455';
string[Symbol.iterator]() //Iterator遍历器
string[Symbol.iterator]().next() //{value: "1", done: false}

//set
let set = new Set(['red', 'green', 'blue']);
set[Symbol.iterator]() //Iterator遍历器
set[Symbol.iterator]().next() //{value: "red", done: false}

//Map
let map = new Map();
let obj= {map: 'map'};
map.set(obj, 'mapValue');
map[Symbol.iterator]().next()  {value: Array(2), done: false}

```

### 十七、问：for...in 和 for...of 有什么区别？

答：如果看到问题十六，那么就很好回答。问题十六提到了 ES6 统一了遍历标准，制定了可遍历对象，那么用什么方法去遍历呢？答案就是用 for...of。ES6 规定，有所部署了载了 Iterator 接口的对象(可遍历对象)都可以通过 for...of 去遍历，而 for..in 仅仅可以遍历对象。

这也就意味着，数组也可以用 for...of 遍历，这极大地方便了数组的取值，且避免了很多程序用 for..in 去遍历数组的恶习。

上面提到的扩展运算符本质上也就是 for..of 循环的一种实现。

### 十八、Generator 函数是什么，有什么作用？

答：如果说 JavaScript 是 ECMAScript 标准的一种具体实现、Iterator 遍历器是 Iterator 的具体实现，那么 Generator 函数可以说是 Iterator 接口的具体实现方式。

执行 Generator 函数会返回一个遍历器对象，每一次 Generator 函数里面的 yield 都相当一次遍历器对象的 next()方法，并且可以通过 next(value)方法传入自定义的 value,来改变 Generator 函数的行为。

Generator 函数可以通过配合 Thunk 函数更轻松更优雅的实现异步编程和控制流管理。

### 十九、async 函数是什么，有什么作用？

答：async 函数可以理解为内置自动执行器的 Generator 函数语法糖，它配合 ES6 的 Promise 近乎完美的实现了异步编程解决方案。

附录：[手写 async await 的最简实现（20 行搞定）！阿里字节面试必考](http://mp.weixin.qq.com/s?__biz=MzAxODE4MTEzMA==&mid=2650079079&idx=2&sn=9eede14eaa71459e0854de70a44585d4&chksm=83da6202b4adeb1408232a8db0b3e6d470564fce73b63c4618d9e2303fec7ef34d8f33eb38cf&scene=21#wechat_redirect)

### 二十、Class、extends 是什么，有什么作用？

答：ES6 的 class 可以看作只是一个 ES5 生成实例对象的构造函数的语法糖。它参考了 java 语言，定义了一个类的概念，让对象原型写法更加清晰，对象实例化更像是一种面向对象编程。Class 类可以通过 extends 实现继承。它和 ES5 构造函数的不同点：

**a**. 类的内部定义的所有方法，都是不可枚举的。

```js
///ES5
function ES5Fun(x, y) {
  this.x = x;
  this.y = y;
}
ES5Fun.prototype.toString = function () {
  return "(" + this.x + ", " + this.y + ")";
};
var p = new ES5Fun(1, 3);
p.toString();
Object.keys(ES5Fun.prototype); //['toString']

//ES6
class ES6Fun {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return "(" + this.x + ", " + this.y + ")";
  }
}

Object.keys(ES6Fun.prototype); //[]
```

**b**.ES6 的 class 类必须用 new 命令操作，而 ES5 的构造函数不用 new 也可以执行。

**c**.ES6 的 class 类不存在变量提升，必须先定义 class 之后才能实例化，不像 ES5 中可以将构造函数写在实例化之后。

**d**.ES5 的继承，实质是先创造子类的实例对象 this，然后再将父类的方法添加到 this 上面。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到 this 上面（所以必须先调用 super 方法），然后再用子类的构造函数修改 this。

### 二十一、module、export、import 是什么，有什么作用？

答：module、export、import 是 ES6 用来统一前端模块化方案的设计思路和实现方案。export、import 的出现统一了前端模块化的实现方案，整合规范了浏览器/服务端的模块化方法，用来取代传统的 AMD/CMD、requireJS、seaJS、commondJS 等等一系列前端模块不同的实现方案，使前端模块化更加统一规范，JS 也能更加能实现大型的应用程序开发。

import 引入的模块是静态加载（编译阶段加载）而不是动态加载（运行时加载）。

import 引入 export 导出的接口值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。

### 二十二、日常前端代码开发中，有哪些值得用 ES6 去改进的编程优化或者规范？

答：

1. 常用箭头函数来取代`var self = this;`的做法。
2. 常用 let 取代 var 命令。
3. 常用数组/对象的结构赋值来命名变量，结构更清晰，语义更明确，可读性更好。
4. 在长字符串多变量组合场合，用模板字符串来取代字符串累加，能取得更好地效果和阅读体验。
5. 用 Class 类取代传统的构造函数，来生成实例化对象。
6. 在大型应用开发中，要保持 module 模块化开发思维，分清模块之间的关系，常用 import、export 方法。
