/**
 * Created by sdm on 14-1-24.
 * Editor by Riant on 15-04-16
 */

chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    function getDomain(url){
        var t=url.split('://')[1];
        return t.split('/')[0];
    }
    switch(request.req){
        case "showip":{
            var hosts = request.hosts,
                _url = getDomain(request.url);
            var style = 'position:fixed;bottom:0;left:0;z-index:99999;padding:3px 5px;background:rgba(0,0,0,.3);color:#FFF;font-size:12px;border-radius:0 3px 0 0;';
            for( var i = 0, len = hosts.length; i < len; i++ ){
                var host = hosts[i];
                if( host.domain === '*' || (host.domain.indexOf('*') > -1 ? (new RegExp('^'+ host.domain.split('.').join('\\.').split('*').join('.*') +'$')).test(_url) : host.domain === _url) ){
                    jQuery('body').append('<div class="hsp-ipview" title="Added By Host Switch Plus ( '+ host.ip +' '+ host.domain +' )" style="'+ style +'">'+ host.ip +'</div>');
                    console.info("Host Switch Plus: " + new Date().Format("hh:mm:ss") + " - " + getDomain(request.url) + '=>' + request.ip + ' ||| ( '+ host.ip +' '+ host.domain +' )');
                    break;
                }
            }
        }

        default:{
        }
    }
    sendResponse({});
});
