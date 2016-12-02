/**
 * {=xxx} ->                                    echo datas.xxx
 * {@if="arguments[0/1]"}...{@else}...{/@if} -> [$index, $data]
 * {@include="#other_template_id"}
 * {@each="items"}...{/@each}
 * {@eval js expression @} ->                   [$index, $data]
 */

// eval
/*jshint -W061 */
// function within a loop
/*jshint -W083 */

;(function($){
    'use strict';
    $.extend({
        extendObj: function(datas, temp, prefix, echoMark){
            echoMark = echoMark || '=';
            prefix = prefix || '';

            var reg_echo = new RegExp('\\{'+ echoMark +'\\s*([^\\}]+)\\s*\\}');
            // var reg_eval =       (/\{@eval\s+([^@]+)\s+@\}/);
            var reg_include = (/\{@include\s*=\s*"([^"]+)"\}/);
            var reg_each =       (/\{@each\s*=\s*"([^"]+)"\}(.*?)(?=\{\/)\{\/@each\}/);
            // var reg_if =           (/\{@if\s*=\s*"([^"]+)"\}(.*?)(?=\{\/)\{\/@if\}/);
            var reg_else = (/(.*)\{@else\}(.*)/);
            var reg_switch = new RegExp('\\{@switch\\s*="'+ echoMark + prefix +'([^"]+)"\\s+case="([^"]+)"\\s+so="([^"]+)"\\s+@\\}');

            temp = typeof temp === 'string' ? $.trim(temp.replace(/(\s*)?(\n|\r)(\s*)?/g,'')) : temp;
            var html = '';
            if( typeof temp === 'number' || temp.length ){
                if( typeof datas == 'number' || (typeof datas == 'string' && datas.length) ){
                    // datas = { value: datas};
                    html += replace4quot(temp, '{'+ echoMark + prefix +'value}', datas);
                } else if( typeof datas == 'object' && datas.length ){  // if it is an array
                    if( typeof datas[0] == 'string' ){
                        for(var i = 0; i < datas.length; i++){
                            html += replace4quot(temp, '{'+ echoMark + prefix +'value}', datas[i]);
                        }
                    } else {
                        for(var j = 0; j < datas.length; j++){
                            datas[j]._index = j;
                            html += objectToHtml(datas[j], null, j);
                        }
                    }
                } else if( typeof datas == 'object' ) {
                    html += objectToHtml(datas);
                }
            }
            return escapeQuote(html, true);

            function objectToHtml(data, item, itemIndex){
                item = $.trim(item || temp);
                var exec;

                while( reg_echo.test(item) ){
                    exec = reg_echo.exec(item);
                    var str = exec[1].replace(prefix, '');
                    var theval = null;

                    var iDot = str.indexOf('.');
                    if( iDot > 0 ){
                        var attrs = str.split('.');
                        theval = data[attrs[0]];
                        for (var i = 1; i < attrs.length; i++) {
                            theval = theval[attrs[i]];
                        }
                    } else {
                        theval = data[str];
                    }
                    item = replace4quot(item, exec[0], theval);
                }
                // eval
                /*jshint -W061 */
                // while( reg_if.test(item) ){
                //     exec = reg_if.exec(item);
                //     var check = (function($index, $data){ return eval(exec[1]); })(itemIndex, data);
                //     var testResult = '';
                //     if( reg_else.test(exec[2]) ){
                //         var elseTest = reg_else.exec(exec[2]);
                //         testResult = check ? elseTest[1] : elseTest[2];
                //     } else {
                //         testResult = check ? exec[2] : '';
                //     }

                //     item = item.split( exec[0] ).join( testResult );
                // }

                while( reg_include.test(item) ){
                    exec = reg_include.exec(item);
                    // item = item.split(exec[0]).join($(exec[1]).html().replace(/(\s*)?(\n|\r)(\s*)?/g,''));
                    item = item.split(exec[0]).join($(exec[1]).extendObj(data));
                }

                while( reg_switch.test(item) ){
                    exec = reg_switch.exec(item);
                    var val = data[exec[1]],
                        _case = exec[2].split(','),
                        _so = exec[3].split(',');
                    var thisHtml = '';

                    if( _case.length === _so.length ){
                        for (var j = 0; j < _case.length; j++) {
                            if( _case[j] === val || _case[j] === val.toString() ){
                                thisHtml = _so[j];
                            }
                        }
                    } else {
                        thisHtml = _so[val];
                    }
                    item = item.split(exec[0]).join(thisHtml);
                }

                while( reg_each.test(item) ){
                    exec = reg_each.exec(item);
                    var itemStr = exec[1];
                    var items = isNaN(Number(itemStr)) ? data[exec[1]] : Number(itemStr),
                        itemTemp = exec[2],
                        itemsHtml = '';
                    if( typeof items == 'object' && items.length ){
                        itemsHtml += $.extendObj(items, itemTemp, '.', ':');
                    } else if( typeof items === 'number' ) {
                        for (var n = 0; n < items; n++) {
                            itemsHtml += $.extendObj({_index: n, _no: (n + 1)}, itemTemp, '.', ':');
                        }
                    }
                    item = item.split(exec[0]).join(itemsHtml);
                }

                // while( reg_eval.test(item) ){
                //     exec = reg_eval.exec(item);
                //     item = item.split(exec[0]).join( (function($i, $d){ return eval(replaceMap(exec[1], ['$i', '$d'], ['arguments[0]', 'arguments[1]'])); })(itemIndex, data) );
                // }
                return item;

                // eval
                /*jshint +W061 */
            }
        }
    });

    $.fn.extend({
        extendObj: function(datas){
            var html = '';
            if( $(this).length ){
                html = $.extendObj(datas, $(this).html());
            }
            return html;
        }
    });

    function replace4quot(str, from, to){
        if( str.indexOf(from) > -1 ){
            return str.split(from).join(to === null || to === undefined ? '' : typeof to === 'boolean' ? (to ? 'true' : 'false') : escapeQuote(to));
        }
        return str;
    }
    function escapeQuote(str, back){
        if( back ){
            return typeof str === 'string' ? str.split('&quot;').join('"').split('&apos;').join('\'') : str;
        }
        return typeof str === 'string' ? str.split('"').join('&quot;').split('\'').join('&apos;') : str;
    }
})(jQuery);