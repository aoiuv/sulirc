## 前言

久违的，又抽时间写个博客（づ￣ 3 ￣）づ ╭❤ ～~

今天想分享一个小动画的实现[头像跳动并高光划过效果展示](https://codepen.io/souliz/pen/pBrVeG)
大家可以先点进去看看效果~**点击头像触发动画效果**~

或者直接看两张图片示意~全部代码贴在文字底部，或者可以点击链接去[CodePen](https://codepen.io/souliz/pen/pBrVeG)

![](https://user-gold-cdn.xitu.io/2019/5/25/16aed13a7eae60a0?w=147&h=148&f=png&s=25658)
![](https://user-gold-cdn.xitu.io/2019/5/25/16aed12d1b6697f7?w=148&h=148&f=png&s=25322)
![](https://user-gold-cdn.xitu.io/2019/5/25/16aed1435abbedbb?w=148&h=147&f=png&s=25681)

## 思考

这里的难度在于高光如何实现？这个动画我不是第一次做了，以为都是用切图实现，正是因为做过多次，这一次想能不能用纯 CSS 代码实现呢？

答案是可以的(●´∀ ｀ ●)ﾉ

首先第一步！也是我放弃切图的第一步！

![高光](https://user-gold-cdn.xitu.io/2019/4/13/16a16f547d30c2de?w=198&h=204&f=png&s=7123)

为了使大家看清楚。我设了黑底，理论上如果切图的话是透明底 PNG。

这里不探讨 CSS 实现和 PNG 哪种方式更好~

首先我设计了高光的两种 CSS 实现方式~

### 弃用方案一

实现长方形和颜色渐变`background: linear-gradient(90deg, transparent 15%, #fff);`后，使其旋转`transform: rotate(?deg);`。多出来的部分会被头像`overflow:hidden`，所以貌似这个高光就轻而易举实现了？但是发现难点就在与实际上宽高和旋转角度如果要和设计稿完全切合的话，需要一定的数学平面几何计算（而我已经还给老师了...）。

### 弃用方案二

直接实现一个矩形的颜色渐变，然后实现左上角和右下角的小三角进行遮罩裁切，可惜这方面我的 Photoshop 功力比 CSS 功力还好...(CSS 里貌似找不到这个支持：一个元素对另一个元素的遮罩，如果有小伙伴知道可以留言告诉我)

## 实现

当我正挣扎回归于切图方案时，此时我想起了一个 CSS 属性[`clip-path`](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path)，大家不妨可以点进这个 MDN 里看看这个属性。关心兼容的同学也可以去看看[兼容情况](https://caniuse.com/#search=clip-path)

MDN 文档介绍：**clip-path CSS 属性可以创建一个只有元素的部分区域可以显示的剪切区域。区域内的部分显示，区域外的隐藏。剪切区域是被引用内嵌的 URL 定义的路径或者外部 svg 的路径，或者作为一个形状例如 circle().。clip-path 属性代替了现在已经弃用的剪切 clip 属性。**

这个属性十分强大。可以裁切出椭圆形、多边形、SVG 路径，还可以根据几何盒子模型来~

很好！我想要的是一个平行四边形，`clip-path: polygon(50% 0, 100% 0%, 50% 100%, 0% 100%);`，很轻松的实现了~

接下来具体的动画要求是：300ms 头像变大，500ms 高光从左至右边划过去，300ms 头像缩放至原本大小。

这个可以通过两个元素的动画组合实现~
`animation: heartbeat 1.1s linear forwards;`
`animation: highlight 1.1s linear forwards;`

由于效果需要适当时机主动召唤出现，所以离不开 Javascript 的帮助啦。这里的实现方式就是需要效果时添加动画 className，动画结束后主动移除 className~

大家感兴趣可以看看代码，PS：CSS 使用了 less 的格式~

## 代码

```html
<div class="user-headpic"></div>
```

```less
@size: 50px;
.user-headpic {
  position: relative;
  display: block;
  width: @size;
  height: @size;
  background: url("https://user-gold-cdn.xitu.io/2018/10/25/166a8fc6cd14bf6f?imageView2/1/w/180/h/180/q/85/format/webp/interlace/1")
    center/cover no-repeat;
  border-radius: 100%;
  border: 2px solid silver;
  overflow: hidden;
  &:after {
    .cube(@size);
    .highlight(@size);
  }
  &.starring {
    animation: heartbeat 1.1s linear forwards;
    &:after {
      animation: highlight 1.1s linear forwards;
    }
  }
}

.cube(@w) {
  content: "";
  position: absolute;
  width: @w;
  height: @w;
}

.highlight(@w) {
  position: absolute;
  width: @w;
  height: @w;
  left: -@w;
  top: 0;
  background: linear-gradient(90deg, transparent 15%, #fff);
  -webkit-clip-path: polygon(50% 0, 100% 0%, 50% 100%, 0% 100%);
  clip-path: polygon(50% 0, 100% 0%, 50% 100%, 0% 100%);
  z-index: 3;
}

@keyframes highlight {
  0 {
    transform: translateX(-@size);
  }
  27.27% {
    transform: translateX(-@size);
  }
  72.73% {
    transform: translateX(2 * @size);
  }
  100% {
    transform: translateX(2 * @size);
  }
}
@keyframes heartbeat {
  0 {
    transform: scale(1);
  }
  27.27% {
    transform: scale(1.2);
  }
  72.73% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
```

## 思考

这个 CSS 属性兼容性不是很友好。不过本着学习的精神去玩一下也是不错的，说不定过几年用的上了哈哈哈~
