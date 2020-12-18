## 前言

这篇博客目测对不用 git 命令行的同学可能帮助不大。但是笔者本人长期使用 git 中开发维护项目。还是感觉命令行十分便利。因此，以下呢实际上是我的笔记~

我们假设，当我们正在进行项目中某一部分的工作开发，里面的东西处于一个比较杂乱的状态，此时我们需要切换分支，但是此时我们并不想提交正在进行一半的的工作内容。此时怎么办呢？

此时解决这个问题的办法就是使用 git stash 命令。

## 基础使用

储藏变更

```bash
$ git stash

Saved working directory and index state WIP on master: 39a3ecf init
```

查看所有储藏

```bash
$ git stash list

stash@{0}: WIP on master: 39a3ecf init
```

备注： WIP 其实就是 Work In Progress 的缩写。

查看某个储藏的内容

```bash
$ git stash show stash@{0}
```

应用最近的一个储藏

```bash
$ git stash apply
```

应用指定的一个储藏

```bash
$ git stash apply stash@{0}
```

## 起个名字

我们会发现以上 git 默认给的索引名字并不友好，时间久了说不定我们就忘了这个储藏是什么内容了。

```bash
$ git stash save "WIP: I name stash, yeah"
```

这时候我们再查看储藏列表

```bash
$ git stash list

stash@{0}: On master: WIP: I name stash, yeah
stash@{1}: WIP on master: 39a3ecf init
```

会发现提示内容的确友好很多了~

## 存储未追踪的文件

一般来说，比如我们新增了 b.txt，git stash 是不会进行储藏的。

```bash
$ git status

On branch master
Untracked files:
  (use "git add <file>..." to include in what will be committed)

	b.txt

nothing added to commit but untracked files present (use "git add" to track)
```

尝试储藏，发现毫无反应！

```bash
$ git stash

No local changes to save
```

但是我们只要加上 --include-untracked 标识符即可

```bash
$ git stash --include-untracked
```

或者简写如下：

```bash
$ git stash -u
```

## 应用与清理

清除最近的储藏同时并应用（应用储藏，同时立刻将该储藏从堆栈中移走），一般比较常用这个命令，但如果不想清除该储藏，可以使用上述提过的 git stash apply 命令。

```bash
$ git stash pop
```

清除最近的储藏

```bash
$ git stash drop
```

清除第 n 个储藏

```bash
$ git stash drop stash@{n}
```

清除所有储藏

```bash
$ git stash clear
```

## 从储藏中创建分支

使用方法：`git stash branch <branchname> [<stash>]`

这个命令会创建一个新的分支，检出你储藏工作时的所处的提交，重新应用你的工作，如果成功，将会丢弃储藏。

```bash
$ git stash branch example
```

这个命令相当实用！可以恢复储藏的工作然后在新的分支上继续当时的工作。

## 小结

最后如果困惑，可查阅官方文档或者手动敲入以下命令~

```bash
$ git stash --help
```

以上，对大家如有助益，不胜荣幸~
