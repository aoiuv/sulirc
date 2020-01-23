本文分享笔者使用 TypeScript 编写运行 Node 应用的一些些经验。基本只需要 3 分钟，即可实现 node + ts 的开发环境配置。

## 开发环境配置

比如笔者要用 ts 写个 socket Node 应用。先用 tree 命令看项目结构。

```bash
$ tree -L 1 socket/
socket/
├── main.ts
├── node_modules
├── package.json
├── static
└── tsconfig.json

2 directories, 3 files
```

配置 ts 配置 tsconfig。当然下述配置可以进行调整，需要留意的是 moduleResolution 配置来指定 node 端的模块寻址算法。可以参考官网文档 [Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)。

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "moduleResolution": "node",
    "downlevelIteration": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

在项目中安装 typescript ts-node-dev 两个开发依赖。

```bash
$ yarn add typescript ts-node-dev -D
```

安装完成后，然后配置 npm 脚本，比如 npm start 命令：

```json
{
  "scripts": {
    "start": "tsnd -P ./tsconfig.json --respawn ./main.ts"
  }
}
```

tsnd 是 ts-node-dev 命令的缩写。上述命令中，只进行了两个配置，-P 代表着配置 tsconfig 的路径，是 --project 的缩写。--respawn 即为观察文件变更以重新运行脚本。更多配置参数可以查看官网文档 [Github | ts-node-dev](https://github.com/whitecolor/ts-node-dev)。平时笔者大约只需要上述两个配置。

同时记得安装 node.js 类型声明包，这样才可以对 node.js 提供 API 方法有默认的类型提示和检查。

```bash
$ yarn add @types/node -D
```

运行开发环境。

```bash
$ npm start
```

以上简单几步即可。

## 生产环境配置

生产环境其实就很简单了，基本上只需要使用 tsc 进行编译成 js 即可。如下：

```json
{
  "scripts": {
    "build": "tsc --project ./"
  }
}
```

```bash
$ npm build
```

以上命令会寻找当前目录下的 tsconfig，按照此配置编译项目的 ts 文件。

更多 tsc 命令请参考 [Compiler Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

## 总结

毕竟你该有的烦恼，社区基本上都有解决办法。接下来只需要尽情享受开发即可。笔者平常基本上依靠上述配置，编写 e2e 测试、Node 应用、以及学习。十分便利。以上简单的教程，希望也能帮到大家。

## 参考资料

- [Github | TypeScript](https://github.com/microsoft/TypeScript)
- [Github | ts-node](https://github.com/TypeStrong/ts-node)
- [Github | ts-node-dev](https://github.com/whitecolor/ts-node-dev)
- [Github | node-dev](https://github.com/fgnass/node-dev)
- [Compiler Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
