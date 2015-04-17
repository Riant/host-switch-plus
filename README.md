# Host Switch Plus - Chrome Extension

Based on [Chrome Host Switch](https://github.com/shendongming/chrome-host-switch)

Change the hosts rules in Chrome. It's easy, and effect immediately.

I just want to make the web developers works happy if they often need to switch hosts between develop/test/production environment.

One more feature is that you can set a local proxy for some kind of domain, For example, if you use Fiddler AutoResponder, you can set the domain IP as 127.0.0.1:8888.

By the way, 
1. if you use windows system and just want to easy to manage you system hosts config, I recommend a windows tool called [SwitchHosts!](http://oldj.net/article/switchhosts/)
2. If you use Fiddler, it had a hosts tool under menu Tools > HOSTS, but I think it's difficult to manage the host rules.

Sorry for my Poor English, learn more from the screenshots please.

Any questions/issues let me know: https://github.com/Riant/host-switch-plus/issues

基于 [Chrome Host Switch](https://github.com/shendongming/chrome-host-switch) 修改完善、分享。感谢原作者开源共享。

> 域名ip切换工具:
> 
> 基于 代理PAC 自动切换一个域名的IP，而不用修改 hosts, 方便web开发人员在 各种/测试/开发/线上 环境快速切换

通过该 Chrome 扩展，快捷方便的切换、设置 host 代理规则。

```
IP:端口 域名 tag 备注
127.0.0.1:8888 www.xyz.com prod Fiddler
127.0.0.1 *.xyz.com
192.168.1.2 www.xyz.com
```

#起缘
在程序开发过程中，难免开发、测试、生产环境各种切换，一般我们直接修改系统的 hosts 文件。

这么做的几个问题：

1. 编辑、管理麻烦，推荐 [SwitchHosts!](http://oldj.net/article/switchhosts/)；

2. 生效延迟。用 Fiddler 的同学可以试试它 Tools 下的 HOSTS 工具；但是这个工具又让我们回到了第一个问题上。

好了，能否有一个工具管理方便，又快捷简单呢？我找到一个 Chrome 扩展 [Chrome Host Switch](https://github.com/shendongming/chrome-host-switch)；问题似乎解决了。

可是为了用 Fiddler，我还装了插件 [Proxy SwitchySharp](https://chrome.google.com/webstore/detail/proxy-switchysharp/dpplabbmogkhghncfbfdeeokoefdjegm?utm_source=chrome-ntp-icon)

而 Chrome 的代理插件只能同时有一个生效，那么有没有什么办法整合一下呢？

感谢 Chrome Host Switch 是在 Github 开源分享，遗憾给他的 Issues 一直没有回应，估计作者也是很久没有跟进了；于是自己动手吧。

大概看了下代理实现部分，尝试修改了一下，同时完善了原作者没有完成的编辑、批量添加等功能，同时新增了一个域名对应多个IP 时，只能有一个生效的检测，并清理了文件很大但用处不多的 Bootstrap 及其 Js 插件。

由于最近忙，没有详细测试完善，任何疑问，建议，欢迎[提交 Issues](https://github.com/Riant/host-switch-plus/issues).

##注：
1. 该版本暂时没有支持原版 Host Switch 的别名功能
    192.168.1.110 web1
    #web1  www.wwbaidu.com




