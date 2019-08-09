# Host Switch Plus - Chrome Extension
最新版：2.0

基于 [Host Switch plus](https://github.com/Riant/chrome-host-switch) 修改完善、分享。感谢原作者开源共享。

[Host Switch plus原版文档](https://github.com/Riant/host-switch-plus/blob/master/README.md)

安装: 下载根目录下的host-switch-plus2.crx文件到浏览器安装

修改和优化

    1.添加在某个目录下才开始代理功能,用于单域名前后端服务器分离的情况
        如配置域名为www.test.com/api,只有当路径为/api开头时才会代理到ip, 如果是url为wwww.test.com/other开头不会代理到ip
    2.添加host时默认为开启状态
    3.修复排序优先级不生效的问题

我会在当前基础上做一段时间的维护, 欢迎提issue, 如果当修改到达一定量会发布版本到chrome


