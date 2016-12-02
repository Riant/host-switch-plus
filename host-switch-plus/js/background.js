var enableHosts = [];

chrome.webRequest.onCompleted.addListener(function (details) {
    //data[details.tabId] = details.ip;
    setTimeout(function(){
        details.req = 'showip';
        details.hosts = enableHosts;
        chrome.tabs.sendRequest(details.tabId, details, function (response) {
            // console.log('res:', response);
        });
    },1000);
}, {
    urls: [ 'http://*/*', 'https://*/*' ],
    types: [ 'main_frame' ]
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    enableHosts = request;
});
