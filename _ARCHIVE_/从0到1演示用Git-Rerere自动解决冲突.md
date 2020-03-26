## 前言

> git rerere 功能是一个隐藏的功能。 正如它的名字 “reuse recorded resolution” 所指，它允许你让 Git 记住解决一个块冲突的方法，这样在下一次看到相同冲突时，Git 可以为你自动地解决它

（呜呼呼~ 最近真的有点忙，差点我都忘了写博客了！赶紧补上一篇）

相信大家也在平常工作中会用到 git，我也在不断持续学习 git，毕竟说实话 git 可能是 21 世纪里最流行的开源分布式版本控制系统了。

然后我在学习 git 的过程中，发现了一个隐蔽很深但相当实用的 git 工具命令 —— git rerere。以下我将带大家用从 0 到 1 建立仓库并演示一遍 git rerere 的使用流程。

## 准备工作

初始化一个示例仓库

```bash
$ mkdir git-rerere-example
$ cd git-rerere-example/
$ git init
```

进行一个初始化提交

```bash
$ echo 'v1.0' > README.md
$ git add .
$ git commit -m "version 1.0"
```

用 git status 查看当前工作树状态

```bash
$ git status

On branch master
nothing to commit, working tree clean
```

ok，当前我们在 master 分支，我们来创建一个特性分支 feat 用来开发某个功能

```bash
$ git checkout -b feat

Switched to a new branch 'feat'
```

很好此时我们有两个分支了。准备工作完成！

```bash
$ git branch

* feat
  master
```

等等！我们还没开启 git rerere 功能，这个很简单！我选择全局配置 git config。当然也可以只是配置当前仓库，把 --global 标识符给去掉即可。

```bash
$ git config --global rerere.enabled true
```

查看是否配置成功，可以看到 rerere.enabled=true，于是准备工作 done！

```bash
$ git config --global --list

user.email=USERNAME@gmail.com
user.name=USERNAME
core.editor=vim
rerere.enabled=true
```

## 演示冲突

假设团队成员 Tom 在 feat 分支上做了一些激动人心的功能，并且发了个特性版本！并且将 README.md 的版本内容声明改成了 v1.1，如下：

```bash
$ echo 'feat: blah' > feat-blah.txt
$ echo 'v1.1' > README.md
```

于是成员 Tom 淡定的在 feat 分支上提交了一个 commit

```bash
$ git add .
$ git commit -m "version v1.1"

[feat b1c500b] version v1.1
 2 files changed, 2 insertions(+), 1 deletion(-)
 create mode 100644 feat-blah.txt
```

查看当前提交情况，可知我们目前 HEAD 指针在 feat 分支，commit 领先于 master

```bash
$ git log --graph --oneline

* b1c500b (HEAD -> feat) version v1.1
* 03bf028 (master) version 1.0
```

让我们切换到 master 分支，同时假设我们身份是另一个团队成员 Jerry。

```bash
$ git checkout master

Switched to branch 'master'
```

成员 Jerry 默默地在 master 分支上工作，同时发了一个大版本 v2.0，如下：

```bash
$ echo 'enjoy weekend!' > daily.txt
$ echo 'v2.0' > README.md
$ git add .
$ git commit -m "version 2.0"

[master 4ab5514] version 2.0
 2 files changed, 2 insertions(+), 1 deletion(-)
 create mode 100644 daily.txt
```

再查看当前提交情况！

```bash
$ git log --graph --oneline

* 4ab5514 (HEAD -> master) version 2.0
* 03bf028 version 1.0
```

过了一段时间，成员 Jerry 觉得可以合并成员 Tom 的特性分支 feat 了~ 于是如下：

```bash
$ git merge feat

Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Recorded preimage for 'README.md'
Automatic merge failed; fix conflicts and then commit the result.
```

看看冲突内容

```bash
$ cat README.md

<<<<<<< HEAD
v2.0
=======
v1.1
>>>>>>> feat
```

但是留意以上 Recorded preimage for 'README.md' 这句提示，git 正在记录你解决冲突的操作！

成员 Jerry 保留自己的改动（因为 master 版本大于 feat 版本），解决了冲突！

```
$ git checkout --ours README.md
$ cat README.md

v2.0
```

于是提交一个新的 commit!

```
$ git add .
$ git commit -m "merge feat"

Recorded resolution for 'README.md'.
[master f1ed9a5] merge feat
```

此时发现 git 提示和以往不一样了，多了一句 Recorded resolution for 'README.md'.

## 使用 git rerere 自动解决冲突

在此之前，查看当前提交情况！可见成功合并了 feat，并且 HEAD 指针在 f1ed9a5

```
$ git log --graph --oneline

*   f1ed9a5 (HEAD -> master) merge feat
|\
| * b1c500b (feat) version v1.1
* | 4ab5514 version 2.0
|/
* 03bf028 version 1.0
```

既然 git 已经记录我们解决冲突的操作，此时让我们重置到 4ab5514（合并 feat 分支之前），也就是上一个提交，可用 HEAD^ 表示

```bash
$ git reset --hard HEAD^

HEAD is now at 4ab5514 version 2.0
```

很好，让我们再尝试一下合并 feat 分支！

```bash
$ git merge feat

Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Resolved 'README.md' using previous resolution.
Automatic merge failed; fix conflicts and then commit the result.
```

此时 git 提示我们 Resolved 'README.md' using previous resolution. 告诉我们自动用我们之前的冲突解决策略解决了 README.md 的冲突

亲眼见证一下！果然成功了，而且在它里面没有合并冲突标记

```bash
$ cat README.md

v2.0
```

当然如果改变想法了，不想用之前的合并冲突策略，也可以

```bash
$ git checkout --conflict=merge README.md
$ cat README.md

<<<<<<< ours
v2.0
=======
v1.1
>>>>>>> theirs
```

这时候就可以重新解决了！

然后你想了想，又想用回之前的合并冲突策略，这时候就直接可以用 git rerere 命令来指示 git 操作

```bash
$ git rerere

Resolved 'README.md' using previous resolution.
```

## 变基

反而言之，我们变基特性分支 feat，一样可以！

```bash
$ git checkout feat
$ git rebase master

...
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
Resolved 'README.md' using previous resolution.
...
```

同样 git 提示了我们 Resolved 'README.md' using previous resolution. 一样复用了之前的合并冲突策略

```bash
$ cat README.md

v2.0
```

然后我们确认无误，如下操作进行提交

```bash
$ git add .
$ git rebase --continue

Applying: version v1.1
```

此时我们查看 commit 提交情况，变基成功！

```
$ git log --graph --oneline

* 2e34640 (HEAD -> feat) version v1.1
* 4ab5514 (master) version 2.0
* 03bf028 version 1.0
```

至此演示已经基本结束了，同学们 get 到了么？

## 应用场景

因为 git rerere 会记住解决一个块冲突的方法，因此至少有以下应用场景：

1. 需要进行多次的重新合并的时候（比如合并 feat 分支，提交测试发现失败，然后重置回去重新合并）
2. 某个特性分支与主开发分支一直保持最新，解决相同的块冲突！
3. 经常使用变基（如以上 feat 分支变基）

总而言之，git rerere 是个相当不错的工具，使用得当的情况下，对工作效率的提升很有帮助~

## 小结

建议同学们可以根据以上流程在命令行中体验一次，然后也可以在工作中使用，说不定会有意外之喜~ 同时也建议大家可以参考官方文档[Git 工具 - Rerere](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-Rerere)学习。

最后，这篇文章对大家如有助益，不胜荣幸~
