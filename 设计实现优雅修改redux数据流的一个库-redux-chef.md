## 前言

首先呢~ 在分享前先贴上我写的redux-chef源码，大家如有兴趣可以阅读：[redux-chef](https://github.com/soulizs/redux-chef/blob/improve-reading/src/redux-chef/index.ts)

## 背景：麻烦的redux社区规范
在使用redux很久以后，有一天写着写着，突然觉得actions/constants/reducers这一套东西显得十分啰嗦（相信很多同学有这种感觉）

比如看redux的官方实例: [todomvc](https://github.com/reduxjs/redux/blob/master/examples/todomvc/src/index.js)。简简单单一个todomvc，也写出来不少样板代码。

哎呀好麻烦吶，我就想简简单单调用改个数据流而已，为啥要我写这么这么长的代码？

于是乎！听闻社区里的那个 **dva** 很强大，我点开官网看了看它的示例，受其启发，忍不住也花了几个小时写了一个 **redux-chef**（不过本身和dva没什么关系，相似的地方也就只有model的设计了）来完成我优雅修改redux数据流的设想~

## 什么有趣的东西？一个主厨（Chef）！
那么平常的redux，除了上述说的代码样板比较多之外，还有一个点也是修改同一个数据，需要跳跃好几个文件，这也是蛮费心力的，个人感觉！

一般来说，一个reducer关注的往往只是其维护的`state`。那么其实可以把每个reducer维护的state、以及其所有的action维护在同一个model里面诶

### 根据业务设计自己的model
首先根据业务场景定义自己的model（为了节省空间，代码省略了一部分），然后用redux-chef导出的kitchen煮一下（笑）。这样的models数据就是经过主厨精心加工过的，可以之后在业务代码里优雅调用了~

```js
// models/index.ts
import { kitchen } from '../redux-chef';
const Cord = {
  namespace: 'cord',
  state: { x: 3, y: 4 },
  action: {
    update(x: number, y: number) {
      return { x, y };
    },
    setDoubleX: () => (state: any) => {
      return {
        ...state,
        x: state.x * 2
      }
    }
  },
  reducer: function (state: any, action: any) {
    //...
  }
};

const Points = {
  namespace: 'points',
  state: [],
  reducer: function (state: any, action: any) {
    //...
  }
};
export default kitchen({ Cord, Points });
```
备注：完整示例models代码 -> https://github.com/soulizs/redux-chef/blob/improve-reading/src/models/index.ts

然后在将这些加工后的models应用到我们用redux创建的store里，就可以开始在应用代码里redux-chef设计的调用啦！

### 优雅又简易的调用方式
示例使用redux-chef后的数据流调用方式如下：
```js
// App.ts
import models from './models/index.ts';

function updateCord() {
  models.Cord.update(generateRandNum(), generateRandNum())
}

function setDoubleCordX() {
  models.Cord.setDoubleX();
}
// render
<Button onClick={updateCord}>update cord x & y</Button>
<Button onClick={setDoubleCordX}>double cord x</Button>
```
天呐，**修改数据流只需要关注models里action函数**，然后在应用里直接调用对应的model：`models.Cord.setDoubleX();`就完成了数据流的改动，然后将对应的state进行connect，即完成了更新后数据的读取。

优雅的是，这种调用给应用开发者带来了流程的简化，只需要关注业务的开发，减少重复的样板代码~

备注：眼尖的同学或许会发现在 **Cord** model里面的这两个action`update`，`setDoubleX`有点不一样。原因是，setDoubleX由于需要读取model里的state，所以设计成高阶函数，用以自动读取其对应model的state！

当然这种方式也提供了使用我们自定义使用action的自由，在model.reducer会进行分发。如下示例代码：

```js
// actions/index.ts
import { dispatch } from '../redux-chef';
export function setCordX(x: number) {
  dispatch({
    type: constants.SET_CORD_X, x
  });
}

// App.ts
import { setCordX } from './actions/index.ts';
// render
<Button onClick={() => setCordX(generateRandNum())}>set cord x</Button>
```

新旧共存，毛问题~

### redux-chef的设计哲学
好了使用方式上文都介绍了，其实redux-chef的设计也挺简单的，主要是`Chef(), dispatch(), cook(), kitchen(), Chef.apply()`这四个API，有兴趣的同学阅读一下源码即可（也不长）。

简单来说：
* 自动聚合所有models的reducer返回给store应用
* 如果调用了model.action，也就是说是这种操作姿势的话，`models.Cord.setDoubleX();`，会使用内部自定义的`@@${__CHEF_INTERNAL_TYPE__}(${name})`分发事件，本质上还是分发。

![](https://user-gold-cdn.xitu.io/2019/5/29/16b042b7d31951d7?w=776&h=108&f=png&s=22426)


* 上文提到的，如果model.action需要使用本身的state作为依赖计算的话，利用高阶函数自动传入state。

* 没什么问题是不能用多一层抽象解决的！

## 小结
1. 建议大家在看完此文后，拉下此仓库运行一下看看！请点击：[redux-chef](https://github.com/soulizs/redux-chef/tree/improve-reading)（注意是improve-reading分支）
2. 不建议大家在生产环境使用redux-chef。由于社区里存在很多优秀的应用框架，比如 **dva** 等等。（备注：本人也只是纯粹随便敲敲而已，暂不发布，也不做维护~

谢谢大家的阅读！当然还有很多优化和设计的空间，大家如果有想法与建议，欢迎评论~

（为什么起这个名字 **redux-chef**？因为我经常在半夜敲代码时感到饥饿...）

