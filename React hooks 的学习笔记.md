> "Unlearn what you have learned" -- Yoda

## 前言

有一天我在逛Medium的时候，突然发现了一篇介绍React Hooks的文章，我认真看了一遍后，计划好好了解一下它。

在学习Hooks之前，官网上说了Hooks是完全可用的（v16.8.0），并没有破坏性变更，而且完全向后兼容，与其说是一种新API，不如说是React Team他们把React更核心的操作数据与UI的能力挖掘了出来。

嗯美滋滋~学完应该可以在工作项目里用了！开始学习吧！

## Hooks的起步使用
其实Hooks主要常用的可以有以下几个：
* `useState`
* `useEffect`
* `useContext`
* `useMemo`
* `useRef`
* `useReducer`
* `useCallback`

列举的以上这几个，其实已经算是比较常用的，尤其是前两个，接下来就会介绍它们部分几个的使用。

### useState

`useState`这个钩子其实对应的是我们之前`class Component`里的`this.setState`。

1. `useState`传参代表默认值，可以是原始值，也可以是对象、数组，所以其实表达能力很丰富。
2. `useState`调用后返回是一对值，对应**当前的值**和**更新这个值的函数**，用数组解构的方式获取很简洁。
3. `useState`在一个函数组件里可以多次使用。
4. `useState`和`this.setState`区别之处在于，前者每次更新后`state`都是新值，换而言之其实是不可变数据的概念。而后者使用后，其实更新`state`部分的值，引用本身并无改变。

简单使用如下示例。

```javascript
import React, { useState } from 'react';

export default function StateHook() {
  const [count, useCount] = useState(0);
  return (
    <>
      <p>You clicked {count} times</p>
      <button onClick={() => useCount(count + 1)}>Click me</button>
    </>
  );
}
```

### useEffect

`useEffect`这个钩子势必是我们常用的。
1. 它基本可以等价于`componentDidMount`和`componentDidUpdate`的这两个生命周期钩子组合的效果。那么它的调用时机大概是每次渲染结束后，所以不会阻塞组件渲染。
2. `useEffect`一般用于实现设置数据请求、监听器等有副作用的功能，传入的第一个参数**函数A1**用于设置副作用，而是传入的这个函数可以返回一个**函数A2**用于取消**函数A1**的副作用。这两个函数的React调用它们时机分别在于，注册副作用的**函数A1**在当次渲染结束后立即执行，取消副作用的**函数A2**在下次渲染开始之前立即执行。再次强调，这么设计的理由还是为了不阻塞组件渲染。
3. `useEffect`第二个参数用于设置副作用的依赖数组。什么意思？思维灵活的同学已经想到了，如果每次渲染都执行副作用，有可能造成性能浪费，那么可以通过告诉React，这个钩子依赖某些`props`或者`states`，在这些依赖不发生改变时，这个副作用不会再重复执行。在以下的例子中，可以传空数组，告诉React该副作用什么也不依赖，那么它只会在第一次渲染时执行一次（但是一般不推荐这么做）。如果不传第二个参数，则意味着每次渲染都必然执行一次，此时应当注意内存泄露。
4. 同学们有没有发现，使用`useEffect`后，一个副作用的注册监听与对应的取消注册逻辑全部放在了一起，对比与以往的分别在`componentDidMount`、`componentDidUpdate`、`componentWillUnmount`里分散同一副作用的逻辑。`useEffect`的使用更有吸引力和说服力了。

```javascript
import React, { useState, useEffect } from 'react';

export default function EffectHook({ dep }) {
  const [width, setWidth] = useState(window.innerWidth);
  
  function handleWindowResize() {
    const w = window.innerWidth;
    setWidth(w);
  }
  
  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, 
    // deps
    []
  );

  return (
    <>
      <p>window.innerWidth: {width}</p>
    </>
  );
}
```

### useContext
这个钩子还是和原有的`Context.Provider`、`Context.Consumer`一样的理解即可。用法示例如下，理解方便，不再赘述。

```
import React, { useContext } from 'react';

export const souliz = {
  name: 'souliz',
  description: 'A normal human named by his cat.'
};

export const UserContext = React.createContext(souliz);

export default function ContextHook() {
  const context = useContext(UserContext);

  return (
    <>
      <p>UserContext name: {context.name}</p>
      <p>UserContext description: {context.description}</p>
    </>
  );
}
```

### useMemo
有时候我们会遇到一个极耗性能的函数方法，但由于依赖了函数组件里一些状态值，又不得不放在其中。那么如果我们每次渲染都去重复调用的发，组件的渲染必然会十分卡顿。

因此写了以下示例验证，一个计算斐波那契的函数（众所周知的慢），读者可以拷贝这段代码，注释`useMemo`那一行，使用直接计算来看，点击按钮触发组件重新渲染，会发现很卡顿（当然了），那么此时`useMemo`作用就发挥出来了，其实理解上还是和原有的`React.memo`一样，可用于缓存一下计算缓慢的函数，如果依赖没有发生改变，则重复使用旧值。前提必然是这个函数是一个纯函数，否则必然会引发问题。

（`useCallback`其实也和`useMemo`道理类似，不过它解决的问题其实如果依赖不改变，使用旧的函数引用，在`useEffect`的依赖是函数时，可以使用`useCallback`的特性来避免重复触发副作用的发生，因此不再赘述`useCallback`）

```javascript
import React, { useState, useMemo } from 'react';

let fib = n => (n > 1 ? fib(n - 1) + fib(n - 2) : n);
let renders = 0;

export default function MemoHook() {
  const defaultInput = 37;
  const [input, setInput] = useState(defaultInput);
  const [time, setTime] = useState(0);
  const value = useMemo(() => fib(input), [input]);
  // 来来来，看看不使用Memo的后果就是卡顿
  // const value = fib(input);

  return (
    <>
      <p>fib value is {value}</p>
      <input
        type="number"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button onClick={() => setTime(time + 1)}>Trigger render {time}</button>
      <footer>render times: {renders++}</footer>
    </>
  );
}
```

### useRef
`useRef`这个钩子需要更通用的理解方式，不同于我们之前使用的`React.createRef()`，这个钩子用于创建的是一个引用对象，那么可以用于突破`useState`所带来的局限。什么意思呢？`useState`每次渲染都是新的值，也就是下面示例中，如果我点击3次按钮，分别更新了值触发5次组件重新渲染，那么通过延时5秒后获取current值如示例二，如果需要在某些操作中获取组件最新的某些`state`是最新的值的时候，`useRef`可以派上大用场。

```javascript
import React, { useRef, useEffect, useState } from 'react';

export default function RefHook() {
  const [count, setCount] = useState(0);
  const latestCount = useRef(count);

  latestCount.current = count;
  useEffect(() => {
    setTimeout(() => {
      console.log(`Ref: You clicked ${latestCount.current} times`);
      console.log(`state: You clicked ${count} times`);
    }, 5000);
  });

  return (
    <>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </>
  );
}
```

```
Ref: You clicked 3 times
state: You clicked 1 times
Ref: You clicked 3 times
state: You clicked 2 times
Ref: You clicked 3 times
state: You clicked 3 times
```

### useReducer
相信同学们都使用过redux，React Team考虑到这种使用方式常见，于是设计出来了这么一个钩子。这样的话其实解决了我们常见写redux的多文件跳跃编写的烦恼，而且十分易于理解。（当然还有比较高级的用法）。以下代码示例。

```javascript
import React, { useState, useReducer } from 'react';

const defaultTodos = [
  {
    id: 1,
    text: 'Todo 1',
    completed: false
  },
  {
    id: 2,
    text: 'Todo 2',
    completed: false
  }
];

function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [
        ...state,
        {
          id:  Date.now(),
          text: action.text,
          completed: false
        }
      ];
    case 'complete':
      return state.map(todo => {
        if (todo.id === action.id) {
          todo.completed = true;
        }
        return todo;
      });
    default:
      return state;
  }
}

export default function ReducerHook() {
  const [todos, dispatch] = useReducer(todosReducer, defaultTodos);
  const [value, setValue] = useState('');

  function handleTextChange(e) {
    setValue(e.target.value);
  }

  function handleAddTodo() {
    if (value === '') {
      return;
    }
    dispatch({
      type: 'add',
      text: value
    });
    setValue('');
  }

  function handleCompleteTodo(id) {
    dispatch({
      type: 'complete',
      id
    });
  }

  return (
    <>
      <section>
        <input
          type="text"
          onChange={handleTextChange}
          value={value}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </section>
      <ul className="todos">
        {todos.map(todo => (
          <ol id={todo.id} key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none'
              }}
            >
              {todo.text}
            </span>
            <input
              type="checkbox"
              disabled={todo.completed}
              onClick={() => handleCompleteTodo(todo.id)}
            />
          </ol>
        ))}
      </ul>
    </>
  );
}
```

其实`useReducer`的原理大概也可以这么来实现。

```javacript
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

相信学完这些Hooks的使用后，许多同学都是内心充满了很多疑惑的同时也想要尝试看看怎么使用到实际项目了。

当然现在React官方的建议是：
* 可以小规模的使用了，但是无需重写以前的组件实现。React是不会移除`class Component`这些原有API的。
* 如果决定使用Hooks的话，可以加上React提供的`eslint-plugin-react-hooks`，用于检测对于Hooks的不正当使用。（听说create-react-app很快将会加上这个配置）
* 学习与使用React Hooks其实更需要的是换一种心智模型去理解，Hooks更多的像是一个同步处理数据的过程。

## Hooks存在的意义以及原因？

传统组件的开发有以下几个局限：

1. 难以复用含有state（状态）的组件逻辑。HOC、render props这两种做法虽然可以解决，但是一是需要重新架构组件，可能会使代码更复杂。二是可能会造成wrapper hell。
2. 复杂组件难以理解消化。因为状态逻辑、消息订阅、请求、以及副作用在不同的生命钩子混乱穿插，彼此耦合，使得一个组件难以再细化拆分。即使使用了Redux这种状态管理的库后，也引进了更高层的抽象，同时需要在不同的文件之间穿插跳跃，复用组件也不是一件容易的事。
3. class让人困惑。（先别急着反对）一个是this让人困惑，常常需要绑定、第二是class转译和压缩出来的代码其实相当冗长。

## Hooks的注意事项
1. 只能在函数的顶层使用，不能嵌套于循环体、判断条件等里面。原因是因为需要确保Hooks每次在组件渲染中都是按照**同样的顺序**，这个十分重要，具体原因将会是一个很大的篇幅
2. 只能在React函数组件里，或者自定义钩子(custom Hooks)里使用。

## 总结
写到这里，文章篇幅已经很长了。一篇文章是说不完Hooks的。学习Hooks的最推荐的其实是看[官网文档](https://reactjs.org/docs/hooks-intro.html)以及[Dan Abramov](https://overreacted.io/)的博文，以及多多动手实践。

![](https://user-gold-cdn.xitu.io/2019/3/24/169aba9b71dc7244?w=703&h=543&f=png&s=668762)

谢谢大家阅读~~