/**
 * Created by sdm on 14-1-18.
 * Editor by Riant on 15-04-16
 * 数据存储类
 *
 * 使用 数据库 存储
 * 参考 http://www.webkit.org/demos/sticky-notes/index.html
 *     http://html5doctor.com/introducing-web-sql-databases/
 *
 *     这里使用
 *     localStorage 序列化存储
 *
 */

(function (window) {
    var model = {};

    //推荐的ip
    var ips=[];
    //字段提示的domain
    var domains=[];

    function uniq_arr(arr,key){
        var dic={}
        for(var i=0;i<arr.length;i++){
            var t=arr[i];
            dic[t[key]]=t;
        }
        var j=0;
        arr.length=0;
        for(var k in dic){
            if(dic.hasOwnProperty(k)){
                arr.push(dic[k]);
                j++;
            }
        }
        return arr;
    }

    function loadsIp(){
        var hosts= loadData('hosts');
        ips.splice(0,ips.length);
        for(var i in hosts){
            ips.push({ip: hosts[i].ip });
            domains.push({domain:hosts[i].domain});
        }

        uniq_arr(ips,'ip');
        uniq_arr(domains,'domain');

        if(last_callback_ip){
            last_callback_ip(ips);
        }
        if(last_callback_domain){
            last_callback_domain(domains);
        }
    }
    //第一次加载
    loadsIp()

    var last_callback_ip=false;
    var last_callback_domain=false;

    model.setAutoIp=function(callback){
        callback(ips);
        last_callback_ip=callback
    }
    model.setAutoDomain=function(callback){
        callback(domains);
        last_callback_domain=callback
    }

    /**
     * 获取标签 有那些
     */
    model.getTags = function () {
        return loadData('tags');
    }


    //添加标签
    model.addTag = function (tagname, description) {
        var tags = model.getTags();
        tags[name] = {desc: description};
        saveData('tags', tags);
    }

    //删除标签
    model.removeTag = function (tagname) {
        var tags = model.getTags();
        delete tags[name];
    }

    //获取列表
    model.getHosts = function () {
        var result = []
        var hosts = loadData('hosts');
        for (var id in hosts) {
            if (hosts.hasOwnProperty(id)) {
                result.push(hosts[id]);
            }
        }
        return result;
    }

    //添加主机
    model.addHost = function (info, enable) {
        if( info.id ){
            model.updateHost(info);
        } else {
            var hosts = loadData('hosts');
            var c = loadData('hosts-count');
            if (!c) {
                c = 0;
            }
            if (!hosts) {
                hosts = {};
            }
            var id = 1 + c;
            info.status = 0;
            info.id = id;

            saveData('hosts-count', id);

            hosts[id] = info;

            saveData('hosts', hosts);

            //修改之后 更新
            loadsIp()
            //自动启动
            if( enable ) model.enableHosts([id]);
            model.reload();
        }
    }


    model.clearkws = function () {
        saveData('kws',[])

    }

    model.getkws = function () {
        var kws = loadData('kws');
        if (!kws) {
            kws = [];
        }
        return kws;
    }

    model.saveKw = function (kw) {
        if (!kw) {
            return;
        }
        //存储搜索记录
        var kws = loadData('kws');
        if (!kws || !kws.splice) {
            kws = [];
        }


        kws.splice(0, 0, kw);
        var kws2 = []
        var kw_map = {}
        for (var i = 0; i < kws.length; i++) {
            var kw = kws[i];
            if (!kw_map[kw]) {
                kws2.push(kw);
            }
            kw_map[kws[i]] = 1;
        }
        kws = kws2.slice(0, 10);


        saveData('kws', kws);
    }
    model.search = function (kw) {
        kw = kw || '';
        model.saveKw(kw);
        var hosts = model.getHosts();

        //filter
        var kws=kw.split(/\s+/);
        for(var i=0;i<kws.length;i++){
            kw=kws[i]

            if (kw) {
                hosts = hosts.filter(function (v) {
                    //单独字段搜索模式
                    if(kw.indexOf(':')!=-1){
                        var arr=kw.split(':');
                        if(v[arr[0]]&& v[arr[0]].indexOf(arr[1])!=-1){
                            return true;
                        }else{
                            return false;
                        }
                    }

                    if (v.domain && v.domain.indexOf(kw) != -1) {
                        return true;
                    }
                    if (v.ip &&  v.ip.indexOf(kw) != -1) {
                        return true;
                    }
                    if(v.tags && v.tags.length && v.tags.indexOf(kw)!=-1){
                        return true;
                    }
                    return false;
                })

            }
        }
        return hosts;
    }


    /**
     * 获取标签的统计
     * @returns {Array}
     */
    model.countTags = function () {
        var tags = {
            'prod': 0,
            'dev': 0,
            'test': 0
        }
        var hosts = loadData('hosts');
        for (var i in hosts) {
            if (hosts.hasOwnProperty(i)) {
                var host = hosts[i];
                if (host.tags && host.tags.push) {
                    for (var x = 0; x < host.tags.length; x++) {
                        var tag = host.tags[x];
                        if (!tags[tag]) {
                            tags[tag] = 0;
                        }
                        tags[tag]++;
                    }
                }

            }
        }
        var result = []
        for (var i in tags) {
            if (tags.hasOwnProperty([i])) {
                result.push({'name': i, 'count': tags[i]});
            }
        }
        return result;
    }

    model.getStatus = function(){
        return loadData('status') ? loadData('status') : 0;
    }

    model.getDefaultMode = function(){
        return loadData('default_mode') ? loadData('default_mode') : 'DIRECT';
    }

    model.getEnabledHosts=function(){
        var results=[];
        var hosts=model.getHosts();
        //别名问题
        var map={};
        var is_ip=new RegExp('([0-9]+\.)+[0-9]+');
        var is_hostname=new RegExp('([^\. ]+)');//比如web1 web2 web-3 非域名
        //别名记录
        var host_alisa={};
        var result_map={};

        //分析别名
        $(hosts).each(function(i,v){
            if(v.status==1){
                if(is_ip.test(v.ip) && is_hostname.test(v.domain)){
                    host_alisa[v.domain]= v.ip + '[@]' + v.id;
                    result_map[v.domain]= v.ip + '[@]' + v.id;
                }
            }
        });

        $(hosts).each(function(i,v){
            if(v.status==1){
                //使用了别名
                if(!is_ip.test(v.ip) && is_hostname.test(v.ip) && host_alisa[v.ip]){
                    result_map[v.domain]=host_alisa[v.ip];
                }else if( is_ip.test(v.ip)){
                    result_map[v.domain]= v.ip + '[@]' + v.id;
                }else{
                    console.log('err:',i,v)
                }
            }
        })

        for(var d in result_map){
            if(result_map.hasOwnProperty(d)){
                var ip_id = result_map[d].split('[@]');
                results.push({domain:d, ip:ip_id[0], id: ip_id[1]});
            }
        }

        return results;
    }

    //重新加载
    model.reload=function(){
        model.setStatus(loadData('status'));
    }

    //开关,启用暂停
    model.setStatus = function (checked, default_mode) {
        saveData('status',checked);
        default_mode = default_mode || this.getDefaultMode();
        saveData('default_mode', default_mode);
        this.checked = checked;

        var script = '';

        if (this.checked) {

            var results=model.getEnabledHosts();
            for(var i =0;i<results.length;i++){
                var info=results[i];
                var ip = info.ip;
                var port = 80;

                if(info.domain.indexOf('*')!=-1){
                    script += '}else if(shExpMatch(host,"' + info.domain + '")){';
                }else if(info.domain.indexOf(':')!=-1){
                    var t=info.domain.split(':');
                    port = t[1];
                    script += '}else if(shExpMatch(url,"http://' + info.domain + '/*")){';
                }else{
                    script += '}else if(host == "' + info.domain + '"){';
                }

                if( info.ip.indexOf(':') > -1 ){
                    var ip_port = info.ip.split(':');
                    ip = ip_port[ip_port.length - 2];
                    port = ip_port[ip_port.length - 1];
                }
                script += 'return "PROXY ' + ip + ':'+ port +'; DIRECT";';

                script+="\n";

            }
            var data='function FindProxyForURL(url,host){ \n if(shExpMatch(url,"http:*") || shExpMatch(url,"https:*")){if(isPlainHostName(host)){return "DIRECT";' +
                script + '}else{return "'+ default_mode +'";}}else{return "SYSTEM";}}';


            chrome.proxy.settings.set({
                value: {
                    mode: 'pac_script',
                    pacScript: {
                        data:data
                    }
                },
                scope: 'regular'
            }, function(){
                //console.log('set pac scripts result:',arguments);
            });
            // $('#msg').html('set :' + script);
        } else {
            chrome.proxy.settings.set({
                value: {
                    //mode: 'system'
                    // mode: 'direct'
                    mode: default_mode.toLowerCase()
                },
                scope: 'regular'
            }, $.noop);
        }
    }
    //移除主机
    model.removeHost = function (id) {
        var hosts = loadData('hosts');
        model.disableHosts(id);
        delete hosts[id];
        saveData('hosts', hosts);
        model.reload();
    }

    model.enableHosts = function (ids) {

        var hosts = loadData('hosts');
        for (var i = 0; i < ids.length; i++) {
            if (hosts[ids[i]]) {
                hosts[ids[i]].status = 1;
            }
        }

        saveData('hosts', hosts);
        model.reload();
    }
    model.disableHosts = function (ids) {
        var hosts = loadData('hosts');
        for (var i = 0; i < ids.length; i++) {
            if (hosts[ids[i]]) {
                hosts[ids[i]].status = 0;
            }
        }

        saveData('hosts', hosts);
        model.reload();
    }

    model.updateHost = function (info) {
        var hosts = loadData('hosts');
        var origin_status = (hosts[info.id]).status;

        info.status = 0;
        hosts[info.id] = info;
        saveData('hosts', hosts);
        if( origin_status ){
            model.enableHosts([info.id]);
        }

        model.reload();
    }


    function saveData(name, value) {
        localStorage[name] = JSON.stringify(value);
    }

    function loadData(name) {
        var s = localStorage[name];
        if (s) {
            try {
                return JSON.parse(s);
            } catch (e) {

            }
        }
        return false;
    }

    window.Model = model;

    // init status as true
    if( localStorage['status'] === undefined ){
        model.setStatus(true, 'DIRECT');
    }
})(window);