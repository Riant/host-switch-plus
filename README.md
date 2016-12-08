# Host Switch Plus - Chrome Extension
最新版：1.3.11

通过该 Chrome 扩展，快捷方便的切换、设置 host 代理规则，而不用修改系统 hosts 文件，方便web开发人员在 各种/测试/开发/线上 环境快速切换

通过 [Chrome Store](https://chrome.google.com/webstore/detail/host-switch-plus/bopepoejgapmihklfepohbilpkcdoaeo?utm_source=chrome-ntp-icon) 安装

无法通过 Chrome Store 安装或者更新的朋友，可以尝试使用 百度浏览器或者360之类的支持 Chrome 扩展的浏览器：
360 浏览器/百度浏览器等其他支持 Chrome 扩展的浏览器，[下载 crx 文件](https://github.com/Riant/host-switch-plus/raw/master/host-switch-plus.crx)，转至浏览器扩展程序管理界面，将下载的 crx 文件拖拽至该页面中释放，即可根据提示安装使用。

批量添加规则（IP:端口、域名、tag、备注分别用空格隔开；多个 tag 用英文逗号隔开）：
```
#IP:端口 域名 tag 备注
127.0.0.1:8888 www.xyz.com prod Fiddler
127.0.0.1 *.xyz.com
192.168.1.2 www.xyz.com
```

注：
1. https: 由于没有 https 目标服务器，https 的支持测试不完整（通过 Fiddler 和 Shadowsocks 2.5.2 测试），如果有需要，请确保您的目标服务器有相应的 https 请求支持。

Install from [Chrome Store](https://chrome.google.com/webstore/detail/host-switch-plus/bopepoejgapmihklfepohbilpkcdoaeo?utm_source=chrome-ntp-icon)

Change the hosts rules in Chrome. It's easy, and effect immediately.

I just want to make the web developers work happy when they often need to switch hosts between develop/test/production environment.

One more feature is that you can set a local proxy for some kind of domain, For example, if you use Fiddler AutoResponder, you may set the domain IP as 127.0.0.1:8888.

By the way:

1. if you use windows system and just want to easy to manage you system hosts config, I recommend a windows tool called [SwitchHosts!](http://oldj.net/article/switchhosts/)

2. If you use Fiddler, it had a hosts tool under menu Tools > HOSTS, but I think it's difficult to manage the host rules.

Sorry for my Poor English, learn more from the screenshots please.

Any questions/issues let me know: https://github.com/Riant/host-switch-plus/issues

Based on [Chrome Host Switch](https://github.com/shendongming/chrome-host-switch)


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

截图预览：

![Popup Screenshot](https://raw.githubusercontent.com/Riant/host-switch-plus/master/screenshots/screenshot-1.png)

![Add New Screenshot](https://raw.githubusercontent.com/Riant/host-switch-plus/master/screenshots/screenshot-add.png)

![Bulk Add Screenshot](https://raw.githubusercontent.com/Riant/host-switch-plus/master/screenshots/screenshot-bulkadd.png)

![Hosts Manage Screenshot](https://raw.githubusercontent.com/Riant/host-switch-plus/master/screenshots/screenshot-hosts.png)

由于最近忙，没有详细测试完善，任何疑问，建议，欢迎[提交 Issues](https://github.com/Riant/host-switch-plus/issues).

基于 [Chrome Host Switch](https://github.com/shendongming/chrome-host-switch) 修改完善、分享。感谢原作者开源共享。

##注：
1. 该版本暂时没有支持原版 Host Switch 的别名功能
    192.168.1.110 web1
    #web1  www.wwbaidu.com


