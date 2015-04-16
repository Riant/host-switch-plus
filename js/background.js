chrome.webRequest.onCompleted.addListener(function (details) {
    //data[details.tabId] = details.ip;
    console.log(details);
    setTimeout(function(){

        details.req = 'showip';

        chrome.tabs.sendRequest(details.tabId, details, function (response) {
            console.log('res:', response)
        });
    },1000);
}, {
    urls: [ 'http://*/*', 'https://*/*' ],
    types: [ 'main_frame' ]
});

