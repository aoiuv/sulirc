## 前言

此篇文章会记录一下我觉得比较实用的 Git+Shell（因为笔者不用 Sourcetree 等图形化工具，命令行效率更高，同时通用价值也更高一点）的小技巧，或者也可以说是骚操作，一是为了给自己当备忘录，二是分享给有需要的同学~

## 技巧

### 批量拉取全部远程分支

平常我们会这样获取所有已追踪的远程分支更新

```bash
git remote update
git pull --all
```

如果想获取全部远程分支并在本地创建（有时候拉取 Github 开源项目学习时，经常需要拉取全部分支），以下命令就可以帮你偷个懒。

```bash
for remote in `git branch -r `; do git branch --track $remote; done
```

### 快速切换分支

有没有一种痛苦，就是切换分支时，一定要写全写对名字才能切换，假如分支名又臭又长的话，那就...那就只有复制粘贴了！

但是且慢！打开 .gitconfig 文件

```bash
open ~/.gitconfig
```

在里面输入：

```
[alias]
  find-branch = !sh -c \"git branch -a | grep -v remotes | grep $1 | head -n 1 | xargs git checkout\"
```

保存后，此时可以直接在命令行里输入分支名的前几个字符就行了（只有你确保唯一，否则默认匹配找到的结果的第一个）

![](https://user-gold-cdn.xitu.io/2019/6/18/16b690ab715e8e54?w=924&h=602&f=png&s=230578)

如图，直接输入`git find-branch ${shortcut}`这种形式，即可快速风骚切换。

（有心的同学发现了，在.gitconfig 和在.bash_profile 里发挥想象力，增加各种 alias 别名，可以迅速提高工作效率）

### 批量对部分文件执行 Git 命令

有时候我们需要对某些文件批量进行 Git 操作，而 Git 本身不一定满足这个需求的时候。可以参考以下命令：

```bash
git status -s | grep "README\.md" | sed 's/A //' | while read i; do git reset HEAD $i; done
git status -s | grep "README\.md" | sed 's/M //' | while read i; do git checkout --ours $i; done
```

上述命令分为两步，一是将此项目中所有`README.md`文件从暂存区恢复到工作区，二是将此项目中所有`README.md`文件的冲突批量改为保留自己的改动。

上述命令经过一定的修改其实可以满足很多场景的！所以不要被限制住了。

## 小知识

以下摘自互联网，命令具体使用详情可自行检索~

### xargs

> xargs 命令是给其他命令传递参数的一个过滤器，也是组合多个命令的一个工具。它擅长将标准输入数据转换成命令行参数，xargs 能够处理管道或者 stdin 并将其转换成特定命令的命令参数。

### sh

> sh 命令是 shell 命令语言解释器，执行命令从标准输入读取或从一个文件中读取。

### grep

> grep（global search regular expression(RE) and print out the line，全面搜索正则表达式并把行打印出来）是一种强大的文本搜索工具，它能使用正则表达式搜索文本，并把匹配的行打印出来。

### sed

> sed 可依照脚本的指令来处理、编辑文本文件。用来自动编辑一个或多个文件、简化对文件的反复操作、编写转换程序

想了解更多也可以参考我之前写的这篇：[Shells 命令行学习笔记](https://juejin.im/post/5ccc5004e51d456e39631950)
