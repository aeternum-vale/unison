chrome.webRequest.onHeadersReceived.addListener((data) => {
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

// chrome.browserAction.onClicked.addListener(function(tab) {
//     console.log(tab)
//     console.log(chrome.extension.getViews());
// });
//chrome.browserAction.setPopup({popup: '../background.html'});

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         console.log(sender.tab ?
//             "from a content script:" + sender.tab.url :
//             "from the extension");
//         console.log(request);
//     });

//console.log(chrome.extension.getViews());


//-----------------------------------------------------

import {
    EventEmitter
} from 'events';

import { Dispatcher } from 'flux';
import AppConstants from './constants';

window.AppDispatcher =  new Dispatcher();

window.Store = Object.assign({}, EventEmitter.prototype, {
    lrc: null,
    artist: null,
    title: null,
    isPlaying: null,
    time: null,

    emitChange() {
        this.emit(AppConstants.CHANGE_EVENT);
    },

    addChangeListener(callback) {
        this.on(AppConstants.CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
        this.removeListener(AppConstants.CHANGE_EVENT, callback);
    }
});

window.AppDispatcher.register(function(payload) {
    switch (payload.type) {
        case AppConstants.LYRYCS_LOAD_SUCCESS:
            window.Store.lrc = payload.lrc;
            window.Store.artist = payload.artist;
            window.Store.title = payload.title;
            window.Store.isPlaying = true;
            window.Store.time = 0;
            window.Store.emitChange();
            break;

        case AppConstants.START_PLAYING:
            window.Store.isPlaying = true;
            window.Store.emitChange();
            break;

        case AppConstants.PAUSE_PLAYING:
            window.Store.isPlaying = false;
            window.Store.emitChange();
            break;


        case AppConstants.JUMP_TO_POSITION:
            window.Store.time = payload.time;
            window.Store.emitChange();
            break;
    }

    return true;
});
