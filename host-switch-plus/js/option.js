/**
 * Created by sdm on 14-1-18.
 * Updated by Riant at 2015-04-16
 */
$(function () {
    model.setAutoIp(function(all){
        var ipList = '';
        for (var i = 0; i < all.length; i++) {
            ipList += '<option value="'+ all[i].ip +'">';
        }
        $('#ip-list').html(ipList);
    });
    model.setAutoDomain(function(all){
        var domainList = '';
        for (var i = 0; i < all.length; i++) {
            domainList += '<option value="'+ all[i].domain +'">'
        }
        $('#domain-list').html(domainList);
    });

    var last_search = model.getkws();
    var kws = []
    $(model.getkws()).each(function (i, v) {
        kws.push({'kw': v});
    });

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


    $('#addForm').on('submit', function(){
        // console.log('普通添加模式');
        var info = {
            'id': Number($('#item-id').val()),
            'ip': $('#ip').val(),
            'domain': $('#domain').val(),
            'note': $('#note').val(),
            'tags': [],
            'status':1,
            'order': $('#order').val() === '' ? 1 : $('#order').val(),
            'uptime': new Date().Format("yyyy-MM-dd hh:mm:ss")
        };
        var add_tags = $('#add_labels').val().split(',');
        $(add_tags).each(function (i, v) {
            if (v) {
                info.tags.push(v);
            }
        });

        $('#div_labels input[type="checkbox"]:checked').each(function () {
            info.tags.push(this.value);
        });

        model.addHost(info);
        $('#listBtn').trigger('click');
        search('');

        return false;
    });

    $('#bulkForm').on('submit', function(){
        var infos = $('#bulkAdd').val().split('\n');
        var rules = /^\s*([^\s]+)\s*([^\s]+)\s*([^\s]+)?\s*([^\s]+)?\s*$/;
        for( var i = 0, len = infos.length; i < len; i++ ){
            var info = $.trim(infos[i]);
            if( info.indexOf('#') === 0 ){
                continue;
            }
            var info = rules.exec(info);
            if( info.length >= 3 ){
                var item = {
                    'ip': $.trim(info[1]),
                    'domain': $.trim(info[2]),
                    'tags': '',
                    'note': $.trim(info[4]) ? $.trim(info[4]) : '',
                    'status': 0,
                    'order': 1,
                    'uptime': new Date().Format("yyyy-MM-dd hh:mm:ss")
                };

                var tags = $.trim(info[3]) ? $.trim(info[3]).split(',') : '';
                if( tags.length ){
                    item.tags = [];
                    $(tags).each(function(i){
                        if( tags[i] !== '' ) item.tags.push(tags[i]);
                    });
                }

                model.addHost(item);
            }
        }
        search('');
        $('#listBtn').trigger('click');
        return false;
    });


    //  批量操作
    //
    $('#select_all').change(function () {
        $('#tbody-hosts').find('input[type=checkbox]').prop('checked', this.checked).change();
    });

    $('#tbody-hosts').on('change', 'input', function (e) {
        // select_one(this.value)
        var tr = $(this).parents('tr');
        if ($(this).prop('checked')) {
            tr.addClass('success');
        } else {
            tr.removeClass('success');
        }
        return false;
    });

    $('#but_del').click(function () {
        $('input[type=checkbox]:checked').each(function () {
            model.removeHost(this.value);
        });
        $('input[type=checkbox]:checked').parents('tr').remove();
        return false;
    });


    $('#add_tab').find('a').on('click', function(){
        var target = $(this).data('target');
        if( target ){
            if( $(target).is('#addForm') ){
                $('#item-id').val('');
                ($(target)[0]).reset();
            }
            $(this).addClass('current').siblings().removeClass('current');
            $(target).addClass('current').siblings().removeClass('current');
            return false;
        } else {
            return true;
        }
    });

    if( location.hash === '#hosts' ) $('#listBtn').trigger('click');
});
