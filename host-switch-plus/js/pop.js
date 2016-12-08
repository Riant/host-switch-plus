/**
 * Created by sdm on 14-1-18.
 * Updated by Riant at 2015-04-16
 */

function search(kw) {
    if( kw === '' ) $('#input_search').val('');

    kw = kw || $('#input_search').val();
    var result = model.search(kw);
    //显示
    render_search_result(result);
}

var model = window.Model;
$(function () {
    var last_search = model.getkws();
    var kws = []
    $(model.getkws()).each(function (i, v) {
        kws.push({'kw': v});
    });

    setTimeout(search);

    function render_label_filter() {
        var tags = model.countTags();
        //标签过滤
        var labels = $('#label-filter')

        //添加 host 表单
        var div_labels = $('#div_labels');
        var total = 0;
        var labels_html = '',
            label_checks = '';

        div_labels.html('');

        for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            if( ! tag.count ) continue;
            total += tag.count;
            if( ! tag.name ) continue;
            labels_html += '<a href="#" data-tag="' + tag.name + '">' + tag.name + '(' + tag.count + ')</a>';
            label_checks += '<label class="checkbox"><input type="checkbox" name="labels[]" value="' + tag.name + '">' + tag.name + '</label>';
        }
        labels.html('<a href="#" data-tag="" class="action">All('+ total +')</a>'+ labels_html);
        div_labels.html(label_checks);
    }

    var labels = $('#label-filter');

    labels.on('click', 'a', function () {
        var tag = $(this).data('tag'),
            s = '';
        if( $(this).hasClass('action') ){
            if( labels.hasClass('noBulk') ) return false;
            // if( tag ){
                var ids = [],
                    all_action = true;
                var trs = $('#tbody-hosts').children();

                $('#tbody-hosts').find('.host-status').each(function(){
                    if( ! Number($(this).data('status')) ){
                        all_action = false;
                        return false;
                    }
                });

                if( ! all_action ){
                    var this_ds = {};

                    var enables = model.getEnabledHosts(),
                        enabled_domains = {},
                        dis_ids = [];
                    for (var i = 0, len = enables.length; i < len; i++) {
                        var enable = enables[i];
                        enabled_domains[enable.domain] = enable.id;
                    };

                    trs.each(function(){
                        var domain = $(this).data('domain');
                        var domain_enabled = enabled_domains[domain];

                        if( domain_enabled && ! $('#host-' + domain_enabled).length )
                            dis_ids.push(domain_enabled);

                        if( ! this_ds[domain] && ! ( domain_enabled && $('#host-' + domain_enabled).length ) ) {
                            ids[ids.length] = $(this).data('id');
                        }

                        this_ds[domain] = $(this).data('id');
                    });


                    if( dis_ids.length ){
                        model.disableHosts(dis_ids);
                    }
                    model.enableHosts(ids);
                } else {
                    trs.each(function(){
                        ids[ids.length] = $(this).data('id');
                    });
                    model.disableHosts(ids);
                }
                render_status(ids, ! all_action, true);
            // }
        } else {
            if( tag ){
                var kw = $('#input_search').val();
                var kws = kw.split(/\s+/);
                for (var i = 0; i < kws.length; i++) {
                    if (kws[i].indexOf(':')) {
                        var t = kws[i].split(':');
                        if (t[0] == 'tags') {
                            kws[i] = '';
                        }
                    }
                }
                kws.push('tags:' + tag);
                s = kws.join(' ');
            }
            $(this).addClass('action').siblings('a').removeClass('action');
            $('#input_search').val(s);
            search();
        }
        return false;
    });

    setTimeout(render_label_filter);

    //状态刷新
    function render_status(ids, status) {
        var id_map = {}
        $(ids).each(function (i, v) {
            id_map[v] = 1;
            var span = $('#tbody-hosts tr#host-' + v).find('.host-status');
            if (status) {
                span.removeClass('status-disabled').addClass('status-enabled');
            } else {
                span.removeClass('status-enabled').addClass('status-disabled');
            }
            span.data('status', status ? 1 : 0);
        })
    }
    var labels = $('#menu')

    labels.on('click', 'a', function () {
        var kw = $(this).data('kw');
        $('#input_search').val(kw).change();
        if (!kw) {
            model.clearkws();
        }
    });

    $('#tbody-hosts').on('click', 'tr', function (e) {
        var $item = $(this);
        if( $('#tbody-hosts').is('.needBulk') ){
            if( e.target.tagName.toLowerCase() !== 'input' ){
                if( e.target.tagName.toLowerCase() === 'a' ){
                    $this = $(e.target);
                    if( $this.is('.delete') ){
                        if( confirm('Delete Confirm') ){
                            model.removeHost($this.data('id'));
                            $item.remove();
                        }
                    } else {// Edit
                        var info = model.getHostById($item.data('id'));
                        var $addForm = $('#addForm');
                        addForm.reset();

                        $('#list').removeClass('current');
                        $addForm.addClass('current').find(':input').each(function(){
                            var $input = $(this);
                            var name = $input.attr('name') || $input.attr('id');
                            if( name ){
                                if( name === 'labels[]' ){
                                    if( info.tag && info.tag.indexOf($input.val()) > -1 ){
                                        this.checked = true;
                                    }
                                } else $input.val(info[name]);
                            }
                        });
                    }
                    return false;
                } else if( $(e.target).children('input').length ){
                    var c = $('input', this);
                    setTimeout(function () {
                        c.prop('checked', !c.prop('checked')).change();
                    });
                }
            }
        } else if(e.target.tagName.toLowerCase() !== 'a') {
            $('.host-status', this).trigger('click');
        }
    });

    $('#input_search').on('keyup', function(){
        clearTimeout($(this).data('t'));
        $(this).data('t', setTimeout(search, 100));
    });
    $('#searchForm').on('submit', function(){
        search();
        return false;
    });

    $("#status").prop('checked', model.getStatus()).change(function () {
        model.setStatus(this.checked, $('#default').val());
    });
    $('#default').val(model.getDefaultMode()).change(function(){
        model.setStatus($("#status")[0].checked, $(this).val());
    });

    function set_status(id,status){
        var ids=[id];
        if(status==1){
            render_status(ids, 1);
            model.enableHosts(ids);
        }else{
            render_status(ids, 0);
            model.disableHosts(ids);
        }
    }

    $('#tbody-hosts').on('click', 'a.host-status', function(){
        var status_obj = $(this);
        var id = status_obj.data('id');
        var host = model.getHostById(id);
        var domain = host.domain,
            status = host.status;
        var ids = [id];

        if(status == '1'){ // 禁用
            render_status(ids, 0);
            model.disableHosts(ids);
        }else{ // 启用
            $('#tbody-hosts').find('.status-enabled').each(function(){ // 禁用相同 domain 的项
                if( $(this).data('domain') === domain ){
                    var another_id = $(this).data('id');
                    render_status([another_id], 0);
                    model.disableHosts([another_id]);
                }
            });

            var enables = model.getEnabledHosts();
            if( enables.length ){
                for (var i = 0, len = enables.length; i < len; i++) {
                    if (enables[i].domain === domain) {
                        model.disableHosts([enables[i].id]);
                    }
                };
            }

            render_status(ids, 1);
            model.enableHosts(ids);
        }
        return false;
    });
})

function render_search_result(result, isBulk) {
    var tbody = $('#tbody-hosts'),
        html = '';
    isBulk = typeof isBulk === 'undefined' ? tbody.is('.needBulk') : isBulk;
    if (result.length == 0) {
        html = '<tr><td colspan="6">No Results</td></tr>';
    } else {
        $(result).each(function (i, v) {
            v.tags = v.tags ? (v.tags.join(', ')) : '';
            v.status_class = v.status ? 'status-enabled' : 'status-disabled';
        });
        html = $('#host-item').extendObj(result);
        tbody.html( html );
    }
}
