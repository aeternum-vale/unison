chrome.webRequest.onHeadersReceived.addListener((data) => {
    console.log('web request');

    data.responseHeaders.push({
        name: 'Access-Control-Allow-Origin',
        value: '*'
    });

    return {
        responseHeaders: data.responseHeaders
    };
}, {
    urls: ["*://google.com/*", "*://lyricslrc.com/*"]
}, [
    "blocking", "responseHeaders"
]);


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        console.log(request);
    });
