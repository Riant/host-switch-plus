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
            //func();
            console.log("Host switch: "+(new Date().Format("hh:mm:ss"))+" - "+getDomain(request.url)+'=>'+request.ip);
            break;
        }

        default:{
        }
    }
    sendResponse({});
});