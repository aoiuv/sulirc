# 检索工具
每个命令都有很详细甚至繁琐的参数，此文只演示简单的使用示例。具体参数以及使用方式可以参照以下四种方式检索：
- 这个网站可以查询一部分命令： https://explainshell.com/
- 输入manual命令：`man ${YOUR_COMMAND}`
- 关于vi的部分：https://vimgifs.com/
- 当然，最后google一下(wink~)

# 命令
## ping
> ping是一种计算机网络工具，用来测试数据包能否透过IP协议到达特定主机。ping的运作原理是向目标主机传出一个ICMP的请求回显数据包，并等待接收回显回应数据包。程序会按时间和成功响应的次数估算丢失数据包率（丢包率）和数据包往返时间（网络时延，Round-trip delay time）。

```bash
ping www.baidu.com
```

备注：这个命令常用于检测域名对应服务器是否在启动状态中。（详细使用参数`man ping`，适用于以下所有命令）。

## traceroute
> traceroute是一种计算机网络工具。它可显示数据包在IP网络经过的路由器的IP地址。

```bash
traceroute www.baidu.com
```
如果系统中不存在此命令，按以下方式安装：
```bash
sudo apt install inetutils-traceroute
sudo apt install traceroute
```

备注：如果某个网站挂了，可以用这个命令检测是哪个环节出了问题。

## nslookup
> nslookup可以指定查询的类型，可以查到DNS记录的生存时间还可以指定使用哪个DNS服务器进行解释。 在已安装TCP/IP协议的电脑上面均可以使用这个命令。 主要用来诊断域名系统 (DNS) 基础结构的信息。

```bash
nslookup www.baidu.com
```

## curl
> cURL是一个利用URL语法在命令行下工作的文件传输工具。

请求www.baidu.com的网页内容
```bash
curl www.baidu.com
```

在输出里带上Http Header（-i --include）
```bash
curl -i www.baidu.com
```

![](https://user-gold-cdn.xitu.io/2019/5/4/16a824840029bd3d?w=2100&h=586&f=png&s=64634)

## nmap
> nmap(“Network Mapper(网络映射器)”) 是一个网络探测和安全扫描程序，系统管理者和个人可以使用这个软件扫描大型的网络，获取那台主机正在运行以及提供什么服务等信息。nmap支持很多扫描技术，例如：UDP、TCP connect()、TCP SYN(半开扫描)、ftp代理(bounce攻击)、反向标志、ICMP、FIN、ACK扫描、圣诞树(Xmas Tree)、SYN扫描和null扫描。

```bash
nmap www.baidu.com
```

备注：一般用来检测该服务器开放的端口。比如以上命令的输出内容如下，可知开放了80、443端口。
```
Starting Nmap 7.70 ( https://nmap.org ) at 2019-05-04 16:52 CST
Nmap scan report for www.baidu.com (14.215.177.38)
Host is up (0.0095s latency).
Other addresses for www.baidu.com (not scanned): 14.215.177.39
Not shown: 998 filtered ports
PORT    STATE SERVICE
80/tcp  open  http
443/tcp open  https

Nmap done: 1 IP address (1 host up) scanned in 4.67 seconds
```

## ufw
> UFW 全称为Uncomplicated Firewall，是Ubuntu 系统上默认的防火墙组件, 为了轻量化配置iptables 而开发的一款工具。 UFW 提供一个非常友好的界面用于创建基于IPV4，IPV6的防火墙规则。

示例比如开启服务器的443（https）端口：

```bash
sudo ufw allow 443
sudo ufw enable
sudo ufw status
```

## ssh
> Secure Shell（安全外壳协议，简称SSH）是一种加密的网络传输协议，可在不安全的网络中为网络服务提供安全的传输环境。 SSH通过在网络中建立安全隧道来实现SSH客户端与服务器之间的连接。

比如创建一个SSH key：
```bash
cd ~/.ssh/
ssh-keygen -t rsa
```

将生成的公钥放置远程服务器中，然后即可以使用私钥登录远程服务器：
```bash
ssh -i ~/.ssh/my_key root@$YOU_SERVER_IP
```

![](https://user-gold-cdn.xitu.io/2019/5/4/16a8248c29fd2d78?w=2132&h=758&f=png&s=158019)

## find
> find是一个用于在文件系统中寻找文件的Unix命令行工具。它的用法包括文件名模式匹配，时间戳匹配。

常用的几个选项为：
- -name
- -type
- -empty
- -executable
- -writable

通用格式如下：
```bash
find $YOU_DIRECTORY/ -name $YOU_FILES
```

示例。比如想在express文件夹中寻找名称含有`Guide`的md文件
```bash
find express/ -name *Guide*.md
```

## grep
> grep是一个最初用于Unix操作系统的命令行工具。在给出文件列表或标准输入后，grep会对匹配一个或多个正则表达式的文本进行搜索，并只输出匹配（或者不匹配）的行或文本。

示例在package.json里搜索作者的名称：
```bash
grep -w "author" express//package.json
```

![](https://user-gold-cdn.xitu.io/2019/5/4/16a824684e977096?w=2160&h=648&f=png&s=113180)
则会输出匹配该`author`单词的一整行

```
"author": "TJ Holowaychuk <tj@vision-media.ca>",
```

备注：这个命令也相当实用~可以查阅文档多多练习！

## ls
常用命令之一，显示当前文件夹的内容
```bash
ls
```
比较常用的是这个组合
```bash
ls -laG
```

![](https://user-gold-cdn.xitu.io/2019/5/4/16a8245ec2fb0ea9?w=2262&h=836&f=png&s=221568)

## cd
> cd命令用来切换工作目录至dirname。 其中dirName表示法可为绝对路径或相对路径。若目录名称省略，则变换至使用者的home directory。

```bash
cd $PATH
```

## pwd
> 在类Unix系统和其他一些操作系统中，pwd（英语：print working directory）用于输出当前工作目录的绝对路径
```bash
pwd
```

## mkdir/rmdir/rm/touch
新建文件夹
```bash
mkdir $FOLDER
```

删除文件夹
```bash
rmdir $FOLDER
```

当然删除文件夹也可以使用以下命令递归删除文件（这个命令需要小心使用）
```bash
rm -rf $FOLDER
```

> touch命令有两个功能：一是用于把已存在文件的时间标签更新为系统当前的时间（默认方式），它们的数据将原封不动地保留下来；二是用来创建新的空文件。

所以一般可以用来新建文件，显得十分方便
```bash
touch $FILE
```

删除文件
```bash
rm $FILE
```

## cat/head/tail/more/less
> cat是unix系统下用来查看文件连续内容用的指令，字面上的含意是“concatenate”(连续)的缩写。除了用来作为显示文件内容外，cat指令也可用于标准流上的处理，如将显示的消息转入或附加另一文件上。
```bash
cat $YOUR_FILE
```

结合标准输出流`>`可以有以下姿势：
```bash
cat $FILE1 > $FILE2
```

关于head/tail/more/less这些命令工作效果大致相似，但是具体不同之处可以使用以上提供的方式查阅

## vi
> vi是一种模式编辑器。不同的按钮和键击可以更改不同的“模式”；比如说：在“插入模式”下，输入的文本会直接被插入到文档；当按下“退出键”，“插入模式”就会更改为“命令模式”，并且光标的移动和功能的编辑都由字母来响应，例如：“j”用来移动光标到下一行；“k”用来移动光标到上一行，“x”可以删除当前光标处的字符，“i”可以返回到“插入模式”（也可以使用方向键）。

掌握简单的vi命令使用十分必要。

使用vim编辑文件
```bash
vi $FILE
```

输入`i`进入INSERT模式，编辑完成后，输入`esc`退出输入INSERT模式，进入命令模式，输入`:wq`写入修改内容并退出vi。

具体使用十分复杂，可以多做练习。简单的使用以上大概可以满足，因为在服务器中没有图形化界面，所以熟悉一定的vi操作是必须的。

## sudo
> sudo是linux系统管理指令，是允许系统管理员让普通用户执行一些或者全部的root命令的一个工具。

备注：普通用户在执行需要root权限的命令时，需要使用此命令。
```bash
sudo $command
```

## chown
> chown 命令将 File 或 Directory 参数指定的文件或目录的所有者更改为 Owner 参数指定的用户。

常见于某个文件或文件夹没有相关的权限时，可以用此命令修改权限。示例如下：
```bash
sudo chown -R $USER:$USER /var/www/
```

![](https://user-gold-cdn.xitu.io/2019/5/4/16a8258d00d55215?w=2142&h=696&f=png&s=70978)

## ps/top
> 在大多数类Unix操作系统中，ps程序（“process status”的简称）可以显示当前运行的进程。一个相关的Unix工具top则可以查看运行进程的实时信息。

```bash
ps
```

```bash
top
```

ps + grep可以快速找到对应程序的进程信息：
```bash
ps -A | grep "vscode"
```

top + grep实时显示系统中对应程序进程（比如微信）的资源占用状况。
```bash
top | grep -i -w "wechat"
```
（这里使用到的`|`是pipeline，可以粗略理解为数据流从左到右的流动）

## pbcopy
将内容复制到粘贴板，示例如下：
```bash
cat $FILE | pbcopy
```
然后愉快的ctrl + v就可以了。

# 小结
以上都只是简单示例，每个命令的深入使用需要在实际工作中查询、实践。（如果以上分享存在错误的地方，欢迎各位同学指正~）

最后，让我们用命令行提高工作效率~冲鸭！(●´∀｀●)ﾉ

