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
    urls: ["<all_urls>"]
}, [
    "blocking", "responseHeaders"
]);
